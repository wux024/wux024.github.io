#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_pubs.py — 自动把新论文加进 _pages/includes/pub.md

用法:
  python scripts/update_pubs.py              # 同步模式: ORCID 发现新论文 -> 生成条目插入 pub.md
  python scripts/update_pubs.py 10.xxxx/xxx  # 手动模式: 按 DOI 添加单篇 (Crossref 取元数据)
  python scripts/update_pubs.py --dry-run    # 只看不改

数据源:
  ORCID   (https://pub.orcid.org/v3.0)   — 发现"我名下有哪些论文"(人工策展, 零误判)
  Crossref(https://api.crossref.org)     — 按 DOI 取官方元数据(作者/期刊/卷期页)

ORCID iD 自动从 _config.yml 的 author.orcid 读取。
论文 <-> 代码仓库的对应关系在 scripts/code_links.json 里维护(可选)。
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "_config.yml"
PUB_MD = ROOT / "_pages" / "includes" / "pub.md"
CODE_LINKS = ROOT / "scripts" / "code_links.json"

UA = "wux024.github.io-pub-sync/1.0 (mailto:wux024@github.com; GitHub Pages site updater)"


def http_get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def read_orcid() -> str:
    m = re.search(r'orcid\s*:\s*"?https?://orcid\.org/([\dX-]{19})"?', CONFIG.read_text(encoding="utf-8"))
    if not m:
        sys.exit("ERROR: _config.yml 里找不到 author.orcid")
    return m.group(1)


def orcid_works(orcid: str) -> list:
    """返回 [{doi, title, year}]，同一论文按 DOI 小写去重。"""
    data = http_get_json(f"https://pub.orcid.org/v3.0/{orcid}/works")
    works, seen = [], set()
    for group in data.get("group", []):
        dois = []
        title = ""
        for summary in group.get("work-summary", []):
            if not title:
                t = summary.get("title", {}).get("title", {}).get("value", "")
                title = t
            for eid in summary.get("external-ids", {}).get("external-id", []):
                if eid.get("external-id-type") == "doi":
                    d = eid.get("external-id-value", "").lower().strip()
                    if d and d not in dois:
                        dois.append(d)
        if not dois:
            continue
        key = sorted(dois)[0]
        if key in seen:
            continue
        seen.add(key)
        works.append({"doi": key, "title": title})
    return works


def crossref(doi: str) -> dict:
    return http_get_json(f"https://api.crossref.org/works/{doi}")["message"]


def orcid_owner_name(orcid: str) -> tuple:
    """(family, given)，用于识别'我本人'作者。失败时退回 ('wu', 'x')。"""
    try:
        d = http_get_json(f"https://pub.orcid.org/v3.0/{orcid}/personal-details")
        fam = d.get("family-name", {}).get("value", "") or "wu"
        giv = d.get("given-names", {}).get("value", "") or "x"
        return fam.lower(), giv.lower()
    except Exception:
        return "wu", "x"


def fmt_authors(crossref_authors: list, self_name: tuple) -> str:
    def short(a):
        fam = (a.get("family") or "").strip()
        giv = (a.get("given") or "").strip()
        inits = ". ".join(p[0].upper() for p in giv.split() if p) + "."
        return f"{fam}, {inits}"

    def is_self(a):
        fam, giv = self_name
        return (a.get("family") or "").strip().lower() == fam and \
               ((a.get("given") or " ").strip()[0].lower() == giv[0])

    names = []
    for a in crossref_authors:
        s = short(a)
        if is_self(a):
            s = f"**{s}**"
        names.append(s)
    if len(names) > 1:
        body = ", ".join(names[:-1]) + ", & " + names[-1]
    else:
        body = names[0] if names else ""
    return body


def build_entry(meta: dict, self_name: tuple, code_links: dict) -> str:
    year = (meta.get("issued", {}).get("date-parts") or [[None]])[0][0] or "n.d."
    title = (meta.get("title") or [""])[0].strip()
    journal = (meta.get("container-title") or [""])[0].strip()
    doi = meta["DOI"].lower()
    authors = fmt_authors(meta.get("authors") or meta.get("author") or [], self_name)

    vol, issue = meta.get("volume", ""), meta.get("issue", "")
    pages = meta.get("page") or meta.get("article-number") or ""
    seg = vol + (f"({issue})" if issue else "")
    tail_parts = [p for p in (seg, pages) if p]
    tail = f", {', '.join(tail_parts)}" if tail_parts else ""

    entry = (f"➤ {authors} ({year}). [{title}](https://doi.org/{doi}). "
             f'<span class="pub-journal">{journal}</span>{tail}.')

    links = code_links.get(doi)
    if links:
        for url in ([links] if isinstance(links, str) else links):
            entry += f' <a href="{url}" class="pub-link"><i class="fab fa-fw fa-github"></i>Code</a>'

    if authors.startswith("**"):
        entry = '➤ <span class="pub-badge pub-first">First Author</span> ' + entry[len("➤ "):]
    return entry


def existing_dois(lines: list) -> set:
    found = set()
    for line in lines:
        for m in re.finditer(r"doi\.org/([^\)\s\"<]+)", line):
            found.add(m.group(1).rstrip(".").lower())
    return found


def insert_entry(lines: list, year: str, entry: str) -> list:
    """插到 '### year' 组顶部；组不存在则按年份降序新建。"""
    heading = f"### {year}"
    for i, line in enumerate(lines):
        if line.strip() == heading:
            return lines[:i + 1] + [entry, ""] + lines[i + 1:]
    for i, line in enumerate(lines):
        m = re.match(r"^### (\d{4})\s*$", line)
        if m and int(m.group(1)) < int(year):
            return lines[:i] + [heading, "", entry, ""] + lines[i:]
    return lines + ["", heading, "", entry]


def load_code_links() -> dict:
    if CODE_LINKS.exists():
        return {k.lower(): v for k, v in json.loads(CODE_LINKS.read_text(encoding="utf-8")).items()}
    return {}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    lines = PUB_MD.read_text(encoding="utf-8").splitlines()
    known = existing_dois(lines)
    code_links = load_code_links()
    orcid = read_orcid()
    self_name = orcid_owner_name(orcid)

    if args and re.match(r"^10\.\d{4,}/", args[0]):
        targets = [("manual", args[0].lower())]
    else:
        works = orcid_works(orcid)
        targets = [(w["title"], w["doi"]) for w in works
                   if not any(d in known for d in [w["doi"]])]

    if not targets:
        print(f"No new publications. (pub.md 已收录 {len(known)} 个 DOI)")
        return

    added, failed = [], []
    for label, doi in targets:
        try:
            meta = crossref(doi)
            entry = build_entry(meta, self_name, code_links)
            year = (meta.get("issued", {}).get("date-parts") or [[None]])[0][0] or "n.d."
            print(f"[NEW] {year} | {entry}")
            if not dry:
                lines = insert_entry(lines, str(year), entry)
            added.append(doi)
        except Exception as e:
            print(f"[FAIL] {doi} ({label[:40]}): {e}")
            failed.append(doi)

    if added and not dry:
        PUB_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print(f"OK: 已写入 {len(added)} 条 -> {PUB_MD.name}，记得核对并酌情补 Code 链接")
    elif dry:
        print(f"(dry-run, 未写入文件; 新增 {len(added)}, 失败 {len(failed)})")


if __name__ == "__main__":
    main()
