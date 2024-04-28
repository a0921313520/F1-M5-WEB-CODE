// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: "https://67fff3d525cf4ff4a60992caa0efeca3@o4504637538959360.ingest.sentry.io/4505116263317504",

        // Adjust this value in production, or use tracesSampler for greater control
        tracesSampleRate: 1,

        // Setting this option to true will print useful information to the console while you're setting up Sentry.
        debug: false,

        replaysOnErrorSampleRate: 1.0,

        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: 0.1,

        // You can remove this option if you're not planning to use the Sentry Session Replay feature:
        integrations: [
            new Sentry.Replay({
                // Additional Replay configuration goes in here, for example:
                maskAllText: true,
                blockAllMedia: true,
            }),
            new Sentry.Integrations.Breadcrumbs({
                console: false,
            }),
        ],
    });
}
