# 🗃️ Markdown Translations

Markdown translations are simply translations that are inside `.md` files. If you feel that a single entry is too long to be in a JSON file (e.g. rules, longer information), it's better to use separate files in Markdown rather than add long entries.

The only exception is when you use many conditions - then it's better **to use many JSON entries rather than a single file.**

## 📝 Adding translation

1. Navigate to `public/translations/contents` directory. Here's an example look of how it should be structurized:

    ```bash
     ~/contents
         /en
             /json      # English JSON/JSONC feature files.
                 example.json
             /markdown  # English Markdown messages.
                 .gitkeep
         /pl
             /json      # Polish JSON/JSONC feature files.
                 example.json
             /markdown  # Polish Markdown messages.
                 .gitkeep
    ```

    Create the locale's `markdown/` directory if it does not exist. JSON feature files are merged separately from the locale's `json/` directory.

> [!IMPORTANT]
> If you don't know how to name the directory, refer to [Discord's API reference](https://docs.discord.com/developers/reference#locales). The application does not support region-based locales of a certain language, so omit the second part of it (e.g, we do not support `en-GB` and `en-US` as there's only `en`).

2. Add a Markdown file under `public/translations/contents/{locale}/markdown/`.

    ```bash
     # public/translations/contents/en/markdown/PublicRules.md
    Rules of the public server:
    1. Do not insult other members.
    2. Have fun.
    ```

3. You can use the translated version via translation manager:
    ```ts
    TranslationsManager.translateMarkdown({
        file: "PublicRules",
        // Most of the time, you'll never hardcode this value, but
        // this is just an example.
        language: Language.ENGLISH,
        data: { coffees_count: 3 },
    })
    ```

Congrats, you just added a new translation! 🥳

The `file` argument is relative to the locale's `markdown/` directory. Both `PublicRules` and `PublicRules.md` work; nested paths such as `rules/PublicRules` are supported. Callers do not include the `markdown/` prefix.

Markdown placeholders can resolve translation keys from any JSON/JSONC feature file in the same locale's merged dictionary. Other placeholders use the supplied `data` values. File names do not add prefixes to translation keys.
