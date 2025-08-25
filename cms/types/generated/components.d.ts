import type { Schema, Struct } from '@strapi/strapi';

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

export interface SiteComponentsSplitHeroColumn extends Struct.ComponentSchema {
  collectionName: 'components_site_components_split_hero_columns';
  info: {
    displayName: 'split-hero-column';
    icon: 'layout';
  };
  attributes: {
    form: Schema.Attribute.Component<'site-components.iframe-form', false> &
      Schema.Attribute.Required;
    imageCollection: Schema.Attribute.Component<
      'site-components.image-collection',
      false
    > &
      Schema.Attribute.Required;
    textBlock: Schema.Attribute.Component<
      'site-components.normal-hero-section',
      false
    > &
      Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['none', 'imageCollection', 'textBlock', 'form']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'none'>;
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
      'site-components.button': SiteComponentsButton;
      'site-components.iframe-form': SiteComponentsIframeForm;
      'site-components.image-collection': SiteComponentsImageCollection;
      'site-components.normal-hero-section': SiteComponentsNormalHeroSection;
      'site-components.split-hero-column': SiteComponentsSplitHeroColumn;
      'site-sections.featured-event': SiteSectionsFeaturedEvent;
      'site-sections.latest-qna': SiteSectionsLatestQna;
      'site-sections.search-section': SiteSectionsSearchSection;
      'site-sections.split-hero-section': SiteSectionsSplitHeroSection;
      'types.social-link': TypesSocialLink;
    }
  }
}
