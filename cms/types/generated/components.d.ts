import type { Schema, Struct } from '@strapi/strapi';

export interface SiteComponentsButton extends Struct.ComponentSchema {
  collectionName: 'components_site_components_buttons';
  info: {
    displayName: 'button';
    icon: 'server';
  };
  attributes: {
    Href: Schema.Attribute.String & Schema.Attribute.Required;
    Icon: Schema.Attribute.Enumeration<
      ['chevron-left', 'chevron-right', 'share', 'calendar', 'search']
    > &
      Schema.Attribute.DefaultTo<'chevron-right'>;
    IsIconOnRightSide: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    Text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteComponentsIframeForm extends Struct.ComponentSchema {
  collectionName: 'components_site_components_iframe_forms';
  info: {
    displayName: 'iframe-form';
    icon: 'code';
  };
  attributes: {
    IFrameFormUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteComponentsImageCollection extends Struct.ComponentSchema {
  collectionName: 'components_site_components_image_collections';
  info: {
    displayName: 'image-collection';
    icon: 'landscape';
  };
  attributes: {
    Images: Schema.Attribute.Media<'images' | 'files', true> &
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
    Alignment: Schema.Attribute.Enumeration<['Left', 'Center', 'Right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Left'>;
    Buttons: Schema.Attribute.Component<'site-components.button', true> &
      Schema.Attribute.Required;
    ButtonsVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    Header: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 32;
      }>;
    HeaderType: Schema.Attribute.Enumeration<['Title', 'H1', 'H2', 'H3']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'H1'>;
    Preheader: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 24;
      }>;
    Subheader: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 64;
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
    Form: Schema.Attribute.Component<'site-components.iframe-form', false> &
      Schema.Attribute.Required;
    ImageCollection: Schema.Attribute.Component<
      'site-components.image-collection',
      false
    > &
      Schema.Attribute.Required;
    TextBlock: Schema.Attribute.Component<
      'site-components.normal-hero-section',
      false
    > &
      Schema.Attribute.Required;
    Type: Schema.Attribute.Enumeration<
      ['None', 'ImageCollection', 'Form', 'TextBlock']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'TextBlock'>;
  };
}

export interface SiteSectionsFeaturedEvent extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_featured_events';
  info: {
    displayName: 'featured-event';
    icon: 'calendar';
  };
  attributes: {
    Header: Schema.Attribute.String;
  };
}

export interface SiteSectionsLatestQna extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_latest_qnas';
  info: {
    displayName: 'latest-qna';
    icon: 'play';
  };
  attributes: {};
}

export interface SiteSectionsSearchSection extends Struct.ComponentSchema {
  collectionName: 'components_site_sections_search_sections';
  info: {
    displayName: 'search-section';
    icon: 'search';
  };
  attributes: {
    header: Schema.Attribute.String;
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
    CenterIfPossible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    LeftComponent: Schema.Attribute.Component<
      'site-components.split-hero-column',
      false
    >;
    RightComponent: Schema.Attribute.Component<
      'site-components.split-hero-column',
      false
    >;
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
