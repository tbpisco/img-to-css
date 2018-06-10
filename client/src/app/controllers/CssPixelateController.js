import { HttpService } from "../services/HttpService";

export class CssPixelateController {

    constructor() {

        this._http = new HttpService();
        this._inputQuantity = document.querySelector('#quantity');
        this._labelQuantity = document.querySelector('#label-quantity');
        this._inputFile = document.querySelector('input[type=file]');

        this._maxRangeValue = 4;
        this._minRangeValue = 1;
        this._setRangeValues(this._minRangeValue,this._maxRangeValue);

        this._init();
    }

    _init(){

        document.querySelector('.submit').addEventListener('click', (event) => {
            event.preventDefault();
            this._uploadImage();                      
        });
    }

    _setRangeValues(min, max){
        this._labelQuantity.innerText = `Quantity (between ${min} and ${max}):`;
        this._inputQuantity.setAttribute("max", max);
        this._inputQuantity.setAttribute("min", min);
    }

    _uploadImage(){

        let file = this._inputFile.files[0];
        let quantity = this._inputQuantity.value;

        this.getDataUrlFromFile(file)
            .then(result => this.getPixelsfromDataUrl(result,quantity))
            .then((result) => this.sendPixels(result.pixels, result.w, result.h, this.getPixelSize(quantity)))
            .then(response => this.getScssPixelsData())
            .then(data => {
                this.addTextIntoScssTab(data);
                this.addScssToDOM();
            })
            .catch(error => alert(error));

    }

    addTextIntoScssTab(data){
        let css = `<!-- HTML CODE -->

        <div class="holder"><div class="image-css"></div></div>

        <!-- END HTML CODE -->
        
        /*CSS CODE*/

        ${data}

        /*END CSS CODE*/
        `;
        document.getElementsByClassName("css-text")[0].innerHTML = css;
    }

    getScssPixelsData(){
        return this._http
            .get(`${SERVICE_URL}/pixel.scss`);
    }

    addScssToDOM(){
        let link = document.createElement("LINK");
        link.setAttribute("href", `${SERVICE_URL}/pixel.scss`);
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    getDataUrlFromFile(file){

        return new Promise((resolve, reject) => {
            
            var reader  = new FileReader();

            reader.addEventListener("load", () => {
            
                resolve(reader.result);
            
            }, false);

            reader.addEventListener("error", (event) => {
            
                reject(event.target.error);
            
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        });
    }

    getPixelsfromDataUrl(dataUrl, quantity){
        
        return new Promise((resolve, reject) => {

            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');

            var img = new Image;

            var percentage = this.getPercentageToReduce(quantity);

            img.onload = () => {
                ctx.drawImage(img,0,0, img.width*percentage, img.height*percentage);
                resolve({pixels: this.getPixels(ctx,0,0,img.width,img.height), w: img.width, h: img.height});
            };

            img.onerror = (event) => {
                reject(event.target.error);
            };

            img.src = dataUrl;
        });
    }

    getPercentageToReduce(value){
        return (1/this._maxRangeValue) * ( value );
    }

    getPixelSize(value){
        return this._maxRangeValue - value + 1;
    }

    getPixels(context, x, y, width, height){
        let img = context.getImageData(x, y, width, height);
        return img.data;
    }

    sendPixels(pixelsArray, w, h, quantity){
        return this._http
            .post(`${SERVICE_URL}/image`, {pixelsArray, w, h, quantity})
    }

}