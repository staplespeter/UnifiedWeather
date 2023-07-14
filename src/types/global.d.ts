import winston from "winston"; 

declare global {
    /** variable in global namespace that holds the logger. */
    var logger: winston.Logger;
}