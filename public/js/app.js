import * as Vue from "./vue.js";
import Focus from "./focus.js";

Vue.createApp({
    components: {
        focus: Focus,
    },
    data: function () {
        return {
            images: [],
            title: "",
            username: "",
            description: "",
            image: null,
            selectedImageId: null,
        };
    },
    mounted: async function () {
        const response = await fetch("/api/images");
        const data = await response.json();
        this.images = data;
    },
    methods: {
        async handleMoreImages() {
            const awaitingData = await fetch(
                `/api/images/more/${this.images[this.images.length - 1].id}`
            );
            const data = await awaitingData.json();
            if (data.id === data.lowestId) {
                this.showMoreButton = false;
            }
            this.images = [...this.images, ...data];
        },

        handleCloseFocus() {
            this.selectedImageId = null;
        },

        handleImageClick(image) {
            console.log("handle click test", image);
            this.selectedImageId = image;
        },

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
}).mount("#main");
