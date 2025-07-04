export interface Country {
    id: number
    name: string
    iso3: string
    iso2: string
    numeric_code: string
    phonecode: string
    capital: string
    currency: string
    currency_name: string
    currency_symbol: string
    tld: string
    native: string
    region: string
    region_id: number
    subregion: string
    subregion_id: number
    nationality: string
    timezones: Array<{
        zoneName: string
        gmtOffset: number
        gmtOffsetName: string
        abbreviation: string
        tzName: string
    }>
    translations: Record<string, string>
    latitude: string
    longitude: string
    emoji: string
    emojiU: string
}


export interface State {
    id: number
    name: string
    country_id: number
    country_code: string
    state_code: string
    type: string
    latitude: string
    longitude: string
}