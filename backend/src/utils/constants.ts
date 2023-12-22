import { Events } from "../entity/events.entity";
import { Inspiration } from "../entity/inspiration.entity";
import { WeeklyDeal } from "../entity/weekly-deal.entity";

export const DEAL_DAY_ID = 1;
export const DAYS_OF_THE_WEEK = 7;
export const COUNT_DEAL_WEEKS_AHEAD = 12;

export const ALLOWED_EVENT_PROPERTIES = ['title', 'description', 'image', 'timestamp', 'archived'];
export const REQUIRED_STORE_PROPERTIES = ['name', 'address', 'weekdays', 'saturdays', 'sundays'];
export const ALLOWED_STORE_PROPERTIES = ['name', 'address', 'phoneNumber', 'email', 'weekdays', 'saturdays', 'sundays', 'instagram'];
export const REQUIRED_BANNER_PROPERTIES = ['text'];
export const ALLOWED_BANNER_PROPERTIES = ['text', 'active'];
export const REQUIRED_INSPIRATION_PROPERTIES = ['title', 'description', 'timestamp'];
export const ALLOWED_INSPIRATION_PROPERTIES = ['title', 'description', 'timestamp', 'archived'];
export const REQUIRED_CATEGORY_PROPERTIES = ['name'];
export const ALLOWED_CATEGORY_PROPERTIES = ['name', 'description', 'archived'];

export const MAX_EVENT_TITLE_LENGTH = 255;
export const MAX_EVENT_DESCRIPTION_LENGTH = 1000;
export const MAX_POST_TITLE_LENGTH = 255;
export const MAX_POST_DESCRIPTION_LENGTH = 1000;
export const MAX_BANNER_LENGTH = 100;

export const ACCEPTED_IMAGE_TYPES = ['deals', 'events', 'inspiration'];
export const IMAGE_TYPE_REPOSITORIES = {
    events: Events,
    deals: WeeklyDeal,
    inspiration: Inspiration,
}

export const IMAGE_TYPES = {
    deals: 'deals',
    events: 'events',
    inspiration: 'inspiration',
} as const;
export type ImageType = keyof typeof IMAGE_TYPES;