class SocialInformation {
    private constructor() {}

    public static get COMMUNITIES_LIST_LINK(): URL {
        return new URL("https://community.oliverperzyk.com")
    }
}

export { SocialInformation }
