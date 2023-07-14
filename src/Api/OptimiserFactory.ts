import ConfigurationManager from "./ConfigurationManager";
import AveragingOptimiser from "./Optimisers/AveragingOptimiser";

/**
 * Creates the optimiser based on the supplied configurations.
 */
export default class OptimiserFactory {
    /**
     * Creates the optimiser based on the configuration in the ConfigurationManager.
     * @param {ConfigurationManager} configManager - The ConfigurationManager holding the configs.
     * @returns {UW.IDataOptimiser[]} An array of datasources.
     */
    create(configManager: ConfigurationManager): UW.IDataOptimiser {
        let optimiser = null;

        switch (configManager.configuration.optimiser) {
            case 'average':
                optimiser = new AveragingOptimiser();
                break;
            default:
                throw new Error('Configuration file optimiser entry not supported for ' + configManager.configuration.optimiser);
        }

        return optimiser;
    }
}