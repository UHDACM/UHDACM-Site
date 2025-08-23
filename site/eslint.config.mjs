import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TODO: use next/image
      '@next/next/no-img-element': 'off',
      // TODO: implement alt text for images
      'jsx-a11y/alt-text': 'off',
      // TODO: stop using any
      '@typescript-eslint/no-explicit-any': 'off',
      // TODO: stop using children prop
      'react/no-children-prop': 'off'
    }
  }
];

export default eslintConfig;
