import yaml from 'js-yaml';
import { ProjectsConfig, Project } from '@/types/projects';
import projectsYaml from './projects.yaml?raw';

/**
 * Filters out projects that don't have any social media or contact information
 * @param project Project to check
 * @returns true if project has at least one social network/contact field
 */
function hasValidLinks(project: Project): boolean {
    const { name, ...links } = project;
    return Object.values(links).some(value => value !== undefined && value.trim() !== '');
}

/**
 * Load and parse the projects configuration from YAML
 */
function loadProjectsConfig(): ProjectsConfig {
    try {
        const config = yaml.load(projectsYaml) as ProjectsConfig;

        // Filter out projects without any social media links
        const filteredProvincial: Record<string, Project[]> = {};

        for (const [province, projects] of Object.entries(config.provincial)) {
            const validProjects = projects.filter(hasValidLinks);
            if (validProjects.length > 0) {
                filteredProvincial[province] = validProjects;
            }
        }

        const filteredNational = config.national.filter(hasValidLinks);

        return {
            provincial: filteredProvincial,
            national: filteredNational,
        };
    } catch (error) {
        console.error('Error loading projects configuration:', error);
        // Return empty configuration on error
        return {
            provincial: {},
            national: [],
        };
    }
}

// Export the loaded configuration
export const projectsConfig = loadProjectsConfig();

// Export individual parts for convenience
export const provinceProjects = projectsConfig.provincial;
export const argentinaProjects = projectsConfig.national;
