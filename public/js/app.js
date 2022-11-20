import * as Vue from "./vue.js";

Vue.createApp({
    data: function () {
        return {
            images: [],
            title: "",
            username: "",
            description: "",
            image: null,
        };
    },
    mounted: async function () {
        const response = await fetch("/api/images");
        const data = await response.json();
        this.images = data;
    },
    methods: {
        handleChange(event) {
            event.preventDefault();
            console.log("handleChange running....");
            this.image = event.target.files[0];
        },
        async handleSubmit(event) {
            console.log("handleSubmit running");
            console.log("this.title: ", this.title);

            event.preventDefault();

            const formData = new FormData();
            formData.append("image", this.image);
            formData.append("title", this.title);
            formData.append("username", this.username);
            formData.append("description", this.description);

            const response = await fetch("/upload", {
                method: "POST",
                body: formData,
            });

            const newImage = await response.json();
            this.images = [newImage, ...this.images];
        },
    },
}).mount("main");
