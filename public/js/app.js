import * as Vue from "./vue.js";

Vue.createApp({
    data: function () {
        return {
            images: [],
        };
    },
    mounted: async function () {
        /* console.log("App:mounted"); */
        const response = await fetch("/api/images");
        const data = await response.json;
        this.images = data;
    },
}).mount("#main");
