import {
    compareAshtakootCompatibility,
    compareDetailedAshtakootCompatibility,
    compareManglikCompatibility
} from '../../clients/navamsha.client.js';
import { COMPATIBILITY_DEFAULT_SETTINGS } from './compatibility.constant.js';

const calculateAshtakootCompatibility = async (data) => {
    const {
        app_package_name,
        bride,
        groom
    } = data;

    const bride_finalSettings = {
        ayanamsha: bride?.settings?.ayanamsha || COMPATIBILITY_DEFAULT_SETTINGS.ayanamsha,
        language: bride?.settings?.language || COMPATIBILITY_DEFAULT_SETTINGS.language,
        observation_point: bride?.settings?.observation_point || COMPATIBILITY_DEFAULT_SETTINGS.observation_point,
    };

    const groom_finalSettings = {
        ayanamsha: groom?.settings?.ayanamsha || COMPATIBILITY_DEFAULT_SETTINGS.ayanamsha,
        language: groom?.settings?.language || COMPATIBILITY_DEFAULT_SETTINGS.language,
        observation_point: groom?.settings?.observation_point || COMPATIBILITY_DEFAULT_SETTINGS.observation_point,
    };

    const { output } = await compareAshtakootCompatibility({
        bride: {
            date: bride.date,
            month: bride.month,
            year: bride.year,
            hours: bride.hours,
            minutes: bride.minutes,
            seconds: bride.seconds,
            timezone: bride.timezone,
            latitude: bride.latitude,
            longitude: bride.longitude,
            settings: bride_finalSettings
        },
        groom: {
            name: groom.name,
            date: groom.date,
            month: groom.month,
            year: groom.year,
            hours: groom.hours,
            minutes: groom.minutes,
            seconds: groom.seconds,
            timezone: groom.timezone,
            latitude: groom.latitude,
            longitude: groom.longitude,
            settings: groom_finalSettings
        },
    });

    return output;
}
const calculateDetailedAshtakootCompatibility = async (data) => {
    const {
        app_package_name,
        bride,
        groom
    } = data;

    const bride_finalSettings = {
        ayanamsha: bride?.settings?.ayanamsha || COMPATIBILITY_DEFAULT_SETTINGS.ayanamsha,
        language: bride?.settings?.language || COMPATIBILITY_DEFAULT_SETTINGS.language,
        observation_point: bride?.settings?.observation_point || COMPATIBILITY_DEFAULT_SETTINGS.observation_point,
    };

    const groom_finalSettings = {
        ayanamsha: groom?.settings?.ayanamsha || COMPATIBILITY_DEFAULT_SETTINGS.ayanamsha,
        language: groom?.settings?.language || COMPATIBILITY_DEFAULT_SETTINGS.language,
        observation_point: groom?.settings?.observation_point || COMPATIBILITY_DEFAULT_SETTINGS.observation_point,
    };

    const { output } = await compareDetailedAshtakootCompatibility({
        bride: {
            date: bride.date,
            month: bride.month,
            year: bride.year,
            hours: bride.hours,
            minutes: bride.minutes,
            seconds: bride.seconds,
            timezone: bride.timezone,
            latitude: bride.latitude,
            longitude: bride.longitude,
            settings: bride_finalSettings
        },
        groom: {
            name: groom.name,
            date: groom.date,
            month: groom.month,
            year: groom.year,
            hours: groom.hours,
            minutes: groom.minutes,
            seconds: groom.seconds,
            timezone: groom.timezone,
            latitude: groom.latitude,
            longitude: groom.longitude,
            settings: groom_finalSettings
        },
    });

    return output;
}
const calculateManglikCompatibility = async (data) => {
    const {
        app_package_name,
        bride,
        groom
    } = data;

    const bride_finalSettings = {
        ayanamsha: bride?.settings?.ayanamsha || COMPATIBILITY_DEFAULT_SETTINGS.ayanamsha,
        language: bride?.settings?.language || COMPATIBILITY_DEFAULT_SETTINGS.language,
        observation_point: bride?.settings?.observation_point || COMPATIBILITY_DEFAULT_SETTINGS.observation_point,
    };

    const groom_finalSettings = {
        ayanamsha: groom?.settings?.ayanamsha || COMPATIBILITY_DEFAULT_SETTINGS.ayanamsha,
        language: groom?.settings?.language || COMPATIBILITY_DEFAULT_SETTINGS.language,
        observation_point: groom?.settings?.observation_point || COMPATIBILITY_DEFAULT_SETTINGS.observation_point,
    };

    const { output } = await compareManglikCompatibility({
        person_a: {
            date: bride.date,
            month: bride.month,
            year: bride.year,
            hours: bride.hours,
            minutes: bride.minutes,
            seconds: bride.seconds,
            timezone: bride.timezone,
            latitude: bride.latitude,
            longitude: bride.longitude,
            settings: bride_finalSettings
        },
        person_b: {
            date: groom.date,
            month: groom.month,
            year: groom.year,
            hours: groom.hours,
            minutes: groom.minutes,
            seconds: groom.seconds,
            timezone: groom.timezone,
            latitude: groom.latitude,
            longitude: groom.longitude,
            settings: groom_finalSettings
        },
    });

    return output;
}

export const compatibilityService = {
    calculateAshtakootCompatibility,
    calculateDetailedAshtakootCompatibility,
    calculateManglikCompatibility
};
