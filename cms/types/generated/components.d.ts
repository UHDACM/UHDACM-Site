import type { Schema, Struct } from '@strapi/strapi';

export interface UserPropertiesUserSocial extends Struct.ComponentSchema {
  collectionName: 'components_user_properties_user_socials';
  info: {
    displayName: 'user_social';
    icon: 'twitter';
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
      ]
    >;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'user-properties.user-social': UserPropertiesUserSocial;
    }
  }
}
