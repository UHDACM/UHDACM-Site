import { SiteSectionFeatureCard } from "@shared/types/cms/CMSTypes";
import { FeatureCardRow } from "@/app/_components/FeatureCard/FeatureCard";
import styles from "./FeatureCardSection.module.css";

const positionClass: Record<SiteSectionFeatureCard["position"], string> = {
    top:    styles.positionTop,
    center: "",
    bottom: styles.positionBottom,
};

export default function FeatureCardSection({ cards, position, sectionID }: SiteSectionFeatureCard) {

    return (
        <div className="SectionRoot" id={sectionID} style={{ margin: "4rem 0" }}>
            <div className={`SectionInner ${positionClass[position]}`}>
                <FeatureCardRow cards={cards} />
            </div>
        </div>
    );
}
