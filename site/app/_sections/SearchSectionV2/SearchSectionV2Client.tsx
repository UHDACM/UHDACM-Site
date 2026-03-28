"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterTab, {
  FilterTabOption,
} from "@/app/_components/FilterTab/FilterTab";
import { SearchBar } from "@/app/_components/SearchBarV2/SearchBarV2";
import SearchTileV2, {
  SearchTileMeta,
} from "@/app/_components/SearchTileV2/SearchTileV2";
import styles from "./SearchSectionV2Client.module.css";

export type SearchSectionV2Item = {
  id: string | number;
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  href: string;
  meta: SearchTileMeta[];
  sortDate: string;
  hasGallery?: boolean;
  location?: string;
  featuredGuests?: string;
  isUpcoming?: boolean;
  upcomingLabel?: string;
};

type SortMode = "newest" | "oldest";
type GalleryFilter = "all" | "hasGallery";

type Props = {
  items: SearchSectionV2Item[];
  type: "events" | "qnas";
};

const COMPACT_BREAKPOINT_PX = 768;

function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT_PX}px)`);
    const update = () => setCompact(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return compact;
}

const SORT_OPTIONS: FilterTabOption[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
];

const GALLERY_OPTIONS: FilterTabOption[] = [
  { label: "All events", value: "all" },
  { label: "With gallery", value: "hasGallery" },
];

export default function SearchSectionV2Client({ items, type }: Props) {
  const compact = useIsCompact();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [sortMode, setSortMode] = useState<SortMode>(() =>
    searchParams.get("sort") === "oldest" ? "oldest" : "newest",
  );
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>(() =>
    searchParams.get("gallery") === "hasGallery" ? "hasGallery" : "all",
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    if (sortMode !== "newest") params.set("sort", sortMode);
    else params.delete("sort");
    if (type === "events" && galleryFilter !== "all")
      params.set("gallery", galleryFilter);
    else params.delete("gallery");

    const next = params.toString();
    const current = searchParams.toString();
    if (next === current) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [query, sortMode, galleryFilter, type, pathname, router, searchParams]);

  const entryTypeLabel = type === "events" ? "event" : "QnA";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = items.slice();

    if (type === "events" && galleryFilter === "hasGallery") {
      result = result.filter((it) => it.hasGallery);
    }

    if (q) {
      result = result.filter((it) => {
        if (it.title.toLowerCase().includes(q)) return true;
        if (it.subtitle?.toLowerCase().includes(q)) return true;
        if (it.location?.toLowerCase().includes(q)) return true;
        if (it.featuredGuests?.toLowerCase().includes(q)) return true;
        return false;
      });
    }

    result.sort((a, b) => {
      const ad = new Date(a.sortDate).getTime();
      const bd = new Date(b.sortDate).getTime();
      return sortMode === "newest" ? bd - ad : ad - bd;
    });

    return result;
  }, [items, query, sortMode, galleryFilter, type]);

  return (
    <div className={styles.tool}>
      <SearchBar
        placeholder={
          type === "events" ? "Search events..." : "Search QnAs..."
        }
        inputValue={query}
        onInputValueChange={setQuery}
      />

      <div className={styles.filterRow}>
        {type === "events" && (
          <FilterTab
            options={GALLERY_OPTIONS}
            value={galleryFilter}
            onChange={(v) => setGalleryFilter(v as GalleryFilter)}
            color='primary'
            compact={compact}
          />
        )}
        <div className={styles.sortFilter}>
          <FilterTab
            options={SORT_OPTIONS}
            value={sortMode}
            onChange={(v) => setSortMode(v as SortMode)}
            color="primary"
            compact={compact}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`BodyRegular ${styles.empty}`}>No results.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((it) => (
            <SearchTileV2
              key={it.id}
              title={it.title}
              subtitle={it.subtitle}
              image={{ src: it.imageSrc, alt: it.imageAlt }}
              meta={it.meta}
              href={it.href}
              entryTypeLabel={entryTypeLabel}
              hasGallery={it.hasGallery}
              isUpcoming={it.isUpcoming}
              upcomingLabel={it.upcomingLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
