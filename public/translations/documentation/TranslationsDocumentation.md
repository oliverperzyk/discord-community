# 📑 Example Translations

This file showcases, how you can your own translation to each language. Due to complexity, it's in a separate file and this page breaks down every single thing that you should know about translations.

If the translation is too long to be just a single entry in JSON file, consider looking up to [translations in Markdown files](./MarkdownTranslationsDocumentation.md).

## 🥥 Translations

> Before we start, navigate to `public/translations/contents` directory. In the root of this directory, each language has it's own JSON file (e.g. `en.json`, `pl.json`). If the language does not exist yet, create an empty file.
>
> ```json
> {
>     "$schema": "../Translations.schemas.jsonc"
> }
> ```
>
> This line of code defines schemas for VS Code to add intellisense and initializes the language itself.

> [!IMPORTANT]
> If you don't know how to name the file, refer to [Discord's API reference](https://docs.discord.com/developers/reference#locales). The application does not support region-based locales of a certain language, so omit the second part of it (e.g, we do not support `en-GB` and `en-US` as there's only `en`).

All translations should be declared as objects. They can some up with properties that you can pass, or returned text can vary because of the passed arguments, e.g.:

> You have 1 coffee.

> You have 2 coffees.

Purpose of arguments is to be able to pass numbers, values etc. into a translation, but also allow to modify the text depending on the amount of things.

### 🌱 Basic translations

The most basic translation only comes up with a text.

```jsonc
{
    "hello": {
        "type": "BASIC",
        "text": "Hello, world!",
    },
}
```

```jsonc
{
    "hello": {
        "type": "BASIC",
        "text": "Witaj, świecie!",
    },
}
```

**Breakdown:**

- `"type"` - It always must be set to `"BASIC"` for all basic translations.
- `"text"` - A constant text of a certain language that'll be rendered.

### 🌿 Translations with arguments

Type `"PARAMETER"` allows to pass arguments to translations. This is only to pass options, you cannot change order depending on the arguments with this type.

```jsonc
{
    "coffees": {
        "type": "PARAMETER",
        "texts": {
            "one": "You have {{ coffees_count }} coffee to claim.",
            "few": "You have {{ coffees_count }} coffees to claim.",
            "many": "You have {{ coffees_count }} coffees to claim.",
            "zero": "You have 0 coffees to claim.",
        },
        "arguments": {
            "coffees_count": {
                "type": "UInt8",
            },
        },
    },
}
```

```jsonc
{
    "coffees": {
        "type": "PARAMETER",
        "texts": {
            "one": "Posiadasz {{ coffees_count }} kawę do odebrania.",
            "few": "Posiadasz {{ coffees_count }} kawy do odebrania.",
            "many": "Posiadasz {{ coffees_count }} kaw do odebrania.",
            "zero": "Posiadasz 0 kaw do odebrania.",
        },
        "arguments": {
            "coffees_count": {
                "type": "UInt8",
            },
        },
    },
}
```

**Breakdown:**

- `"type"` - It always must be set to `"PARAMETER"` for all translations that do have parameter, but do not re-arrange text in any way.
- `"arguments"` - An object that contains all arguments that user _must or can_ pass. See more information about [arguments on this page](./ArgumentsTypes.md).
- `"texts"` - An object of texts. To pass arguments, use a flat variable format: `{{ your_variable }}`. You should add following translations:
    - `"one"` - Used if the selected _count_ element is equal to one.
    - `"few"` - Used if the selected _count_ element is plural, but not in a very high quantity (it might vary of the language, what's the range).
    - `"many"` - Used if the selected _count_ element is plural and in a high quantity.
    - `"zero"` - Used if the selected _count_ element is equal to zero. Rarely used.
