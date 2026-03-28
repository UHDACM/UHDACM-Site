import type { Schema, Struct } from '@strapi/strapi';

export interface SiteComponentsAnnouncementSubHeader
  extends Struct.ComponentSchema {
  collectionName: 'components_site_components_announcement_sub_headers';
  info: {
    displayName: 'announcement-sub-header';
    icon: 'bulletList';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<['calendar', 'clock', 'location-pin']> &
      Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteComponentsButton extends Struct.ComponentSchema {
  collectionName: 'components_site_components_buttons';
  info: {
    displayName: 'button';
    icon: 'server';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.Enumeration<
      ['chevron-left', 'chevron-right', 'share', 'calendar', 'search']
    > &
      Schema.Attribute.DefaultTo<'chevron-right'>;
    isIconOnRightSide: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    target: Schema.Attribute.Enumeration<
      ['_self', '_blank', '_parent', '_top']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'_self'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteComponentsCard extends Struct.ComponentSchema {
  collectionName: 'components_site_components_cards';
  info: {
    displayName: 'card-section-card';
    icon: 'stack';
  };
  attributes: {
    href: Schema.Attribute.Text;
    icon: Schema.Attribute.Enumeration<
      ['heart', 'target', 'code', 'users', 'calendar', 'people', 'clock']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'code'>;
    subtitle: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteComponentsFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_site_components_feature_cards';
  info: {
    displayName: 'feature-card';
    icon: 'grid';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'accent', 'background']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Enumeration<
      ['heart', 'target', 'code', 'users', 'calendar', 'people', 'clock']
    > &
      Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
  };
}

export interface SiteComponentsFloatingImages extends Struct.ComponentSchema {
  collectionName: 'components_site_components_floating_images';
  info: {
    displayName: 'floating-images';
    icon: 'apps';
  };
  attributes: {
    images: Schema.Attribute.Media<'files' | 'images', true> &
      Schema.Attribute.Required;
  };
}

export interface SiteComponentsIframeForm extends Struct.ComponentSchema {
  collectionName: 'components_site_components_iframe_forms';
  info: {
    displayName: 'iframe-form';
    icon: 'code';
  };
  attributes: {
    iFrameFormUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteComponentsImageCollection extends Struct.ComponentSchema {
  collectionName: 'components_site_components_image_collections';
  info: {
    displayName: 'image-collection';
    icon: 'landscape';
  };
  attributes: {
    images: Schema.Attribute.Media<'images' | 'files', true> &
      Schema.Attribute.Required;
  };
}

export interface SiteComponentsNormalHeroSection
  extends Struct.ComponentSchema {
  collectionName: 'components_site_components_normal_hero_sections';
  info: {
    displayName: 'hero-text-block';
    icon: 'file';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left'>;
    buttons: Schema.Attribute.Component<'site-components.button', true> &
      Schema.Attribute.Required;
    buttonsVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    header: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 64;
      }>;
    headerType: Schema.Attribute.Enumeration<['Title', 'H1', 'H2', 'H3']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'H1'>;
    preheader: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    subheader: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 512;
      }>;
  };
}

export interface SiteComponentsSingleImage extends Struct.ComponentSchema {
  collectionName: 'components_site_components_single_images';
  info: {
    displayName: 'single-image';
    icon: 'file';
  };
  attributes: {
    image: Schema.Attribute.Media<'files' | 'images'> &
      Schema.Attribute.Required;
  };
}

export interface SiteComponentsSplitHeroColumn extends Struct.ComponentSchema {
  collectionName: 'components_site_components_split_hero_columns';
  info: {
    displayName: 'split-hero-column';
    icon: 'layout';
  };
  attributes: {
    floatingImages: Schema.Attribute.Component<
      'site-components.floating-images',
      false
    > &
      Schema.Attribute.Required;
    form: Schema.Attribute.Component<'site-components.iframe-form', false> &
      Schema.Attribute.Required;
    imageCollection: Schema.Attribute.Component<
      'site-components.image-collection',
      false
    > &
      Schema.Attribute.Required;
    singleImage: Schema.Attribute.Component<
      'site-components.single-image',
      false
    > &
      Schema.Attribute.Required;
    textBlock: Schema.Attribute.Component<
      'site-components.normal-hero-section',
      false
    > &
      Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      [
        'none',
        'imageCollection',
        'singleImage',
        'floatingImages',
        'textBlock',
        'form',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'none'>;
  };
}

export interface SiteComponentsVerticalTimelineEntry
  extends Struct.ComponentSchema {
  collectionName: 'components_site_components_vertical_timeline_entries';
  info: {
    displayName: 'vertical-timeline-entry';
    icon: 'clock';
  };
  attributes: {
    date: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    href: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteSectionsAnnouncement extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_announcements';
  info: {
    displayName: 'announcement';
    icon: 'bell';
  };
  attributes: {
    sectionID: Schema.Attribute.String;
  };
}

export interface SiteSectionsCardSection extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_card_sections';
  info: {
    displayName: 'card-section';
    icon: 'apps';
  };
  attributes: {
    cards: Schema.Attribute.Component<'site-components.card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
          min: 1;
        },
        number
      >;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteSectionsFeatureCardSection extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_feature_card_sections';
  info: {
    displayName: 'feature-card-section';
    icon: 'apps';
  };
  attributes: {
    cards: Schema.Attribute.Component<'site-components.feature-card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    position: Schema.Attribute.Enumeration<['top', 'center', 'bottom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
  };
}

export interface SiteSectionsFeaturedEvent extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_featured_events';
  info: {
    displayName: 'featured-event-section';
    icon: 'calendar';
  };
  attributes: {
    header: Schema.Attribute.String;
    sectionID: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
  };
}

export interface SiteSectionsLatestQna extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_latest_qnas';
  info: {
    displayName: 'latest-qna';
    icon: 'play';
  };
  attributes: {
    reverseOnDesktop: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    sectionID: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
  };
}

export interface SiteSectionsLeadershipSection extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_leadership_sections';
  info: {
    displayName: 'leadership-section';
    icon: 'user';
  };
  attributes: {
    sectionID: Schema.Attribute.String;
  };
}

export interface SiteSectionsSearchSection extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_search_sections';
  info: {
    displayName: 'search-section';
    icon: 'search';
  };
  attributes: {
    defaultSortingMode: Schema.Attribute.Enumeration<
      ['ascending', 'descending']
    > &
      Schema.Attribute.Required;
    header: Schema.Attribute.String;
    listingMode: Schema.Attribute.Enumeration<['on', 'after', 'before']> &
      Schema.Attribute.Required;
    sectionID: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    type: Schema.Attribute.Enumeration<['events', 'galleries', 'qnas']> &
      Schema.Attribute.Required;
  };
}

export interface SiteSectionsSplitHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_split_hero_sections';
  info: {
    displayName: 'split-hero-section';
    icon: 'layout';
  };
  attributes: {
    centerIfPossible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    leftComponent: Schema.Attribute.Component<
      'site-components.split-hero-column',
      false
    >;
    reverseOnDesktop: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    reverseOnMobile: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    rightComponent: Schema.Attribute.Component<
      'site-components.split-hero-column',
      false
    >;
    sectionID: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
  };
}

export interface SiteSectionsVerticalTimeline extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_vertical_timelines';
  info: {
    displayName: 'vertical-timeline';
    icon: 'bulletList';
  };
  attributes: {
    entries: Schema.Attribute.Component<
      'site-components.vertical-timeline-entry',
      true
    >;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TypesAnnouncement extends Struct.ComponentSchema {
  collectionName: 'components_types_announcements';
  info: {
    displayName: 'announcement';
    icon: 'bell';
  };
  attributes: {
    badge: Schema.Attribute.Text;
    body: Schema.Attribute.Text;
    buttons: Schema.Attribute.Component<'site-components.button', true>;
    colorTheme: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'accent', 'background']
    >;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    subheader: Schema.Attribute.Component<
      'site-components.announcement-sub-header',
      true
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TypesSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_types_social_links';
  info: {
    displayName: 'Social-Link';
    icon: 'manyWays';
  };
  attributes: {
    type: Schema.Attribute.Enumeration<
      [
        'linkedin',
        'x',
        'facebook',
        'instagram',
        'personal_site',
        'youtube',
        'github',
        'discord',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'link'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'site-components.announcement-sub-header': SiteComponentsAnnouncementSubHeader;
      'site-components.button': SiteComponentsButton;
      'site-components.card': SiteComponentsCard;
      'site-components.feature-card': SiteComponentsFeatureCard;
      'site-components.floating-images': SiteComponentsFloatingImages;
      'site-components.iframe-form': SiteComponentsIframeForm;
      'site-components.image-collection': SiteComponentsImageCollection;
      'site-components.normal-hero-section': SiteComponentsNormalHeroSection;
      'site-components.single-image': SiteComponentsSingleImage;
      'site-components.split-hero-column': SiteComponentsSplitHeroColumn;
      'site-components.vertical-timeline-entry': SiteComponentsVerticalTimelineEntry;
      'site-sections.announcement': SiteSectionsAnnouncement;
      'site-sections.card-section': SiteSectionsCardSection;
      'site-sections.feature-card-section': SiteSectionsFeatureCardSection;
      'site-sections.featured-event': SiteSectionsFeaturedEvent;
      'site-sections.latest-qna': SiteSectionsLatestQna;
      'site-sections.leadership-section': SiteSectionsLeadershipSection;
      'site-sections.search-section': SiteSectionsSearchSection;
      'site-sections.split-hero-section': SiteSectionsSplitHeroSection;
      'site-sections.vertical-timeline': SiteSectionsVerticalTimeline;
      'types.announcement': TypesAnnouncement;
      'types.social-link': TypesSocialLink;
    }
  }
}
