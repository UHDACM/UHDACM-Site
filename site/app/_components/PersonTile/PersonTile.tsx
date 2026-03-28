"use client";

import React, { HTMLAttributeAnchorTarget, useEffect, useState } from "react";
import "./PersonTile.css";
import Transition from "../Transition/Transition";
import {
  DefaultFacebook,
  DefaultGithub,
  DefaultGlobe,
  DefaultLinkedin,
  DefaultInstagram,
  DefaultTwitter,
  DefaultYoutube,
  DefaultClose,
  DefaultDiscord,
} from "@/app/_icons/Icons";
import { SocialSite } from "@shared/types/cms/CMSTypes";
import {
  FunctionUnknown,
  CardinalDirection,
} from "@shared/types/general/generalTypes";
import { useBodyOverflowY } from "@/app/_features/body/useSetBodyOverflowY";
import IndicateScrollableDiv from "../IndicateScrollableDiv/IndicateScrollableDiv";

export type PersonTileSocial = {
  icon: SocialSite;
  style?: React.CSSProperties;
  href?: string;
  href_target?: HTMLAttributeAnchorTarget;
  onClick?: FunctionUnknown;
};
export type CoverOrContain = "cover" | "contain";

const iconMap = {
  personal_site: DefaultGlobe,
  facebook: DefaultFacebook,
  instagram: DefaultInstagram,
  linkedin: DefaultLinkedin,
  x: DefaultTwitter,
  github: DefaultGithub,
  youtube: DefaultYoutube,
  discord: DefaultDiscord,
};

const wipeDir: CardinalDirection = "right";
const SocialIconStyle: React.CSSProperties = {
  margin: 0,
  padding: 3,
  borderRadius: 10,
  cursor: "pointer",
  color: "rgb(var(--color-font-default))",
};

/**
 * The clickable preview tile: image, gradient overlay, and title/subtitle.
 * Reused by both PersonTile (self-managed expand) and PersonTileCarousel
 * (shared lightbox).
 */
export function PersonTilePreview({
  img,
  imgCoverOrContain = "cover",
  title,
  subtitle,
  titleStyle,
  subtitleStyle,
  style,
  ariaLabel,
  onClick,
}: {
  img?: string;
  imgCoverOrContain?: CoverOrContain;
  title?: string;
  subtitle?: string;
  titleStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? title}
      style={{
        border: "none",
        background: "transparent",
        padding: 0,
        font: "inherit",
        textAlign: "left",
        ...style,
      }}
      className="ImgContainer"
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          margin: "0.5rem",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "0.1rem",
        }}
      >
        <p
          style={{ color: "white", margin: 0, ...titleStyle }}
          className={"BodyRegularHeavy"}
        >
          {title || "Title"}
        </p>
        <p
          style={{ color: "white", margin: 0, ...subtitleStyle }}
          className={"BodyCaption"}
        >
          {subtitle || "Subtitle"}
        </p>
      </div>
      <div className="previewImageOverlayGradient" />
      {img && (
        <img
          style={{
            height: "100%",
            width: "100%",
            objectFit: imgCoverOrContain,
          }}
          src={img}
          alt={ariaLabel ?? title ?? ""}
        />
      )}
    </button>
  );
}

/**
 * The expanded card content (image + description card with socials + close).
 * Contains no backdrop or transition so each consumer can wrap it with its
 * own overlay/animation.
 */
export function PersonTileExpanded({
  title,
  subtitle,
  description,
  img,
  socials,
  imgCoverOrContain = "cover",
  onClose,
}: {
  title?: string;
  subtitle?: string;
  description?: string;
  img?: string;
  socials?: PersonTileSocial[];
  imgCoverOrContain?: CoverOrContain;
  onClose?: FunctionUnknown;
}) {
  function HandleClickSocialIcon(
    href?: string,
    href_target?: HTMLAttributeAnchorTarget,
  ) {
    href && window.open(href, href_target || "_blank");
  }

  return (
    <div className={"expandedImgAndCardContainer"}>
      <div className={"expandedImgContainer imageShiftMobile"}>
        {img && (
          <img
            style={{
              height: "100%",
              width: "100%",
              objectFit: imgCoverOrContain,
              position: "relative",
            }}
            src={img}
            alt={title ?? ""}
          />
        )}
      </div>
      <div className={"expandedDescriptionCard"}>
        <div className={"expandedDescription"}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.1rem",
            }}
          >
            <p
              style={{ color: "rgb(var(--color-font-default))" }}
              className={"expandedCardText H4"}
            >
              {title || "Title"}
            </p>
            <p
              style={{
                color: "rgb(var(--color-font-default))",
                fontWeight: 500,
              }}
              className={"expandedCardText BodyLarge"}
            >
              {subtitle || "Subtitle"}
            </p>
          </div>
          <IndicateScrollableDiv
            className={"expandedCardText expandedCardFullDescription BodyRegular"}
          >
            {description || "Description"}
          </IndicateScrollableDiv>
        </div>
        <div className="expandedCardIconContainer">
          {socials?.map(
            ({ icon, style, href, href_target, onClick }, index) => {
              const key = `Social_Icon_${index}`;
              const onClickFunc = () => {
                HandleClickSocialIcon(href, href_target);
                onClick && onClick();
              };
              const combinedStyles = { ...SocialIconStyle, ...style };
              const IconComponent = iconMap[icon];
              if (!IconComponent) return null;
              return (
                <IconComponent
                  size={"2rem"}
                  style={combinedStyles}
                  onClick={onClickFunc}
                  key={key}
                />
              );
            },
          )}
        </div>
        <DefaultClose
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            cursor: "pointer",
            color: "rgb(var(--color-font-default))",
          }}
          size={"2rem"}
          onClick={() => onClose && onClose()}
        />
      </div>
    </div>
  );
}

export default function PersonTile({
  tileStyle,
  previewTitleStyle,
  previewSubTitleStyle,
  img,
  imgCoverOrContain = "cover",
  previewTitle,
  previewSubTitle,
  fullTitle,
  fullSubtitle,
  fullDescription,
  socials,
  onClickTile,
  onClose,
}: {
  tileStyle?: React.CSSProperties;
  previewTitleStyle?: React.CSSProperties;
  previewSubTitleStyle?: React.CSSProperties;
  img?: string;
  imgCoverOrContain?: CoverOrContain;
  previewTitle?: string;
  previewSubTitle?: string;
  fullTitle?: string;
  fullSubtitle?: string;
  fullDescription?: string;
  socials?: PersonTileSocial[];
  onClickTile?: FunctionUnknown;
  onClose?: FunctionUnknown;
}) {
  const [open, setOpen] = useState(false);
  const { disableOverflowY, enableOverflowY } = useBodyOverflowY();

  useEffect(() => {
    if (open) {
      disableOverflowY();
    } else {
      enableOverflowY();
    }
  }, [open]);

  return (
    <>
      <PersonTilePreview
        img={img}
        imgCoverOrContain={imgCoverOrContain}
        title={previewTitle}
        subtitle={previewSubTitle}
        titleStyle={previewTitleStyle}
        subtitleStyle={previewSubTitleStyle}
        style={tileStyle}
        onClick={() => {
          setOpen(!open);
          onClickTile && onClickTile();
        }}
      />
      <Transition
        transitionSpeedMS={400}
        delayBefore={200}
        hideOnToggleOff={false}
        type="wipe"
        direction={wipeDir}
        fps={60}
        toggle={open}
        easing="inOutQuart"
        forceStyle={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1000,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <Transition
          delayAfter={300}
          transitionSpeedMS={200}
          fps={30}
          type="fade"
          toggle={open}
          forceStyle={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100%",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "#0008",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PersonTileExpanded
              title={fullTitle}
              subtitle={fullSubtitle}
              description={fullDescription}
              img={img}
              socials={socials}
              imgCoverOrContain={imgCoverOrContain}
              onClose={() => {
                setOpen(false);
                onClose && onClose();
              }}
            />
          </div>
        </Transition>
      </Transition>
    </>
  );
}
