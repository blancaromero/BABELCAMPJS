import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { Post } from "../../models/post";
import { User } from "../../models/user";
import { PostService } from '../../services/post.service';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { PostDetailsResolve } from '../../services/post-details-resolve.service';

@Component({
    selector: "post-form",
    templateUrl: "post-form.component.html",
    styleUrls: ["post-form.component.css"]
})
export class PostFormComponent implements OnInit {

    post: Post;
    newPost: boolean = true;
    //id: number;

    nowDatetimeLocal: string;
    publicationDateScheduled: boolean = false;

    @Output() postSubmitted: EventEmitter<Post> = new EventEmitter();

    constructor(private _activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {

        this.nowDatetimeLocal = this._formatDateToDatetimeLocal(new Date());

        this._activatedRoute.data.forEach(
            (data: {post: Post}) => {
               
                this.post = data.post;
                console.log(this.post);
                
                if(!this.post) {
                    this.post = { id: 0, title: '', intro: '', body: '', media: '', publicationDate: this._getPostPublicationDate(this.nowDatetimeLocal),
                         categories: [], author: User.defaultUser(), likes: 0 };
                }
            }
        );
    }

    private _formatDateToDatetimeLocal(date: Date) {
        return `
            ${this._fixPad(date.getFullYear(), 4)}-
            ${this._fixPad(date.getMonth() + 1, 2)}-
            ${this._fixPad(date.getDate(), 2)}T
            ${this._fixPad(date.getHours(), 2)}:
            ${this._fixPad(date.getMinutes(), 2)}`.replace(/\n/gi, "").replace(/ /gi, "");
    }

    private _fixPad(datePart: number, length: number): string {
        return `0000${datePart}`.slice(-length);
    }

    private _getPostPublicationDate(formPublicationDate: string): number {
        let publicationDate: Date;
        if (this.publicationDateScheduled) {
            publicationDate = new Date(formPublicationDate);
            if (isNaN(publicationDate.getTime())) {
                publicationDate = new Date();
            }
        }
        else {
            publicationDate = new Date();
        }
        return publicationDate.getTime();
    }

    setScheduling(schedule: boolean): void {
        this.publicationDateScheduled = schedule;
    }

    submitPost(form: FormGroup): void {

        /*-------------------------------------------------------------------------------------------------------------|
         | ~~~ Purple Path ~~~                                                                                         |
         |-------------------------------------------------------------------------------------------------------------|
         | Aquí no tienes que hacer nada más allá de comprobar que los datos del formulario se recogen correctamente y |
         | tienen 'forma' de Post. Si no es así, al hacer 'Post.fromJson()' se instanciará un post que no se parece en |
         | nada a lo indicado en el formulario. Por tanto, pon especial atención a que los nombres indicados en los    |
         | distintos elementos del formulario se correspondan con las propiedades de la clase Post.                    |
         |-------------------------------------------------------------------------------------------------------------*/
        
        /*let post: Post = Post.fromJson(form.value);
        post.likes = 0;
        post.author = User.defaultUser();
        post.publicationDate = this._getPostPublicationDate(form.value.publicationDate);
        post.media = '';
        post.categories = [];*/

        this.postSubmitted.emit(this.post);
    }

    goBack() {
        window.history.back();
    }
}
