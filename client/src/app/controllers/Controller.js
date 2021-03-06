import { HttpService } from "../services/HttpService";
import {View} from "../views/View";
import { isMobile } from 'mobile-device-detect';

export class Controller {

    constructor() {

        this._http = new HttpService();
        this._view = new View();     

        this.current_hash = "";

        this._maxRangeValue = 4;
        this._minRangeValue = 1;
        this._maxSize = 30;
        //this._setRangeValues(this._minRangeValue,this._maxRangeValue);

        this._init();
    }

    _init(){

        if(!this.isAdvancedUpload())document.querySelector("body").classList.add("no-drag");
        if(isMobile)document.querySelector("body").classList.add("mobile");

        this._resetLabel();

        this.addEvents();

        this.getScssDefaultPixelsData()
            .then(data => {
                this._view.addTextIntoScssTab(data);
                this.addScssDefaultToDOM();
                this.getDefaultSassCodeData()
                    .then(data => this._view.addSassCode(data))
                    .catch(error => console.log(error));
            })

        this.getDefaultSassCodeData()
            .then(data => this._view.addSassCode(data))
            .catch(error => console.log(error));
    }

    addEvents(){

        this._view.btnSubmit.addEventListener('click', (e) => this.onSubmit.call(this, e));
        this._view._btnHtml.addEventListener('click',  (e) => this._view.showHtml.call(this._view, e));
        this._view._btnScss.addEventListener('click',  (e) => this._view.showScss.call(this._view, e));
        this._view._btnCss.addEventListener('click', (e) => this._view.showCss.call(this._view, e));

        this._view._fileUploadContainer.addEventListener("dragover", this._view.containerActive);
        this._view._fileUploadContainer.addEventListener("dragenter", this._view.containerActive);
        this._view._fileUploadContainer.addEventListener("dragleave", this._view.containerRemoveActive);
        this._view._fileUploadContainer.addEventListener("dragend", this._view.containerRemoveActive);
        this._view._fileUploadContainer.addEventListener("drop", (e ) => {this.drop.call(this, e)});

        this._view.btnCopy.addEventListener("click", this.copyCurrentTab.bind(this));

        this._view._inputFile.addEventListener("change", this.changeInput.bind(this));
    }

    copyCurrentTab(e){
        this.copyText(document.querySelector('.result div.active').innerText);
        this._view.btnCopyChangeLabel();
    }

    copyText(_string){
		var textArea = document.createElement('textarea');
	    textArea.setAttribute('style','width:1px;border:0;opacity:0;');
	    document.body.appendChild(textArea);
	    textArea.value = _string;
	    textArea.select();
    	document.execCommand('copy');
    	document.body.removeChild(textArea);
	}

    changeInput(e){
        if(!this._view._inputFile.files[0])return;
        this._uploadImage(this._view._inputFile.files[0]);
    }

    onSubmit(e){
        e.preventDefault();
        this._uploadImage(this._view._inputFile.files[0]); 
    }

    drop(e){

        e.stopPropagation();
        e.preventDefault();
        this._view.containerRemoveActive(e);
        this._uploadImage(e.dataTransfer.files);
    }    

   /* _setRangeValues(min, max){
        this._labelQuantity.innerText = `Quantity (between ${min} and ${max}):`;
        this._inputQuantity.setAttribute("max", max);
        this._inputQuantity.setAttribute("min", min);
    }*/

    _uploadImage(file){

        if(file.length > 0)file = file[0];

        let maxSize = this._maxSize * 1024;

        if(file){

            var fileSize = file.size; // in bytes

            if(fileSize > maxSize){

                this._view.updateLabelText('file size is more than ' + maxSize + ' bytes. Choose another file.');
                return false;

            } else {

                this._view.updateLabelText('file size is correct - ' + fileSize + ' bytes. Uploading...');
            }

        } else {

            this._view.updateLabelText('choose file, please');
            return false;
        }

        let quantity = 4;

        this.getDataUrlFromFile(file)
            .then(result => this.getPixelsfromDataUrl(result,quantity))
            .then((result) => this.sendPixels(result.pixels, result.w, result.h, this.getPixelSize(quantity)))
            .then((response) => this.getScssPixelsData(response.data))
            .then(data => {
                this._view.addTextIntoScssTab(data);
                this.addScssToDOM(this.current_hash);
                this.getSassCodeData(this.current_hash)
                    .then(data => {this._view.addSassCode(data); this._resetLabel();})
                    .catch(error => console.log(error));
            }) 
            .catch(error => console.log(error));

    }

    getScssPixelsData(data){
        this.current_hash = data;
        return this._http
            .get(`/uploads/${data}.scss`);
    }

    getScssDefaultPixelsData(){
        return this._http
            .get(`/default.scss`);
    }

    getSassCodeData(data){
        return this._http
            .get(`/sass/${data}`);
    }

    getDefaultSassCodeData(){
        return this._http
            .get(`/sass`);
    }

    _resetLabel(){
        this._view.updateLabelText(`Images up to ${this._maxSize} Kb.`);
    }

    addScssToDOM(filename){
        this.appendLinkToDOM(`/uploads/${filename}.scss`);
    }

    addScssDefaultToDOM(){
        this.appendLinkToDOM(`/default.scss`);
    }

    appendLinkToDOM(href){
        let link = document.createElement("LINK");
        link.setAttribute("href", href);
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
            .post(`/image`, {pixelsArray, w, h, quantity})
    }

    isAdvancedUpload() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }

}