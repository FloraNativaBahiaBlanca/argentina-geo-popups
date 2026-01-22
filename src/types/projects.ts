/**
 * Schema for projects with social media links
 * 
 * This schema is designed to be easily extensible:
 * - To add a new social network, simply add it to the Project interface
 * - Projects without values for certain fields won't display those links
 */

/**
 * Supported social networks and contact methods
 * Add new platforms here as needed
 */
export interface Project {
    /** Display name of the project */
    name: string;

    /** Instagram profile URL or handle */
    instagram?: string;

    /** X (formerly Twitter) profile URL or handle */
    x?: string;

    /** Facebook page URL or handle */
    facebook?: string;

    /** Website URL */
    web?: string;

    /** Contact email address */
    contacto?: string;

    /** YouTube channel URL (example of extensibility) */
    youtube?: string;

    /** TikTok profile URL (example of extensibility) */
    tiktok?: string;

    /** LinkedIn profile URL (example of extensibility) */
    linkedin?: string;

    /** Threads profile URL (example of extensibility) */
    threads?: string;

    /** Mastodon profile URL (example of extensibility) */
    mastodon?: string;

    /** Allow any additional social network fields */
    [key: string]: string | undefined;
}

/**
 * Configuration structure for all projects
 */
export interface ProjectsConfig {
    /** Projects organized by province name */
    provincial: Record<string, Project[]>;

    /** National-level projects (Argentina-wide) */
    national: Project[];
}
