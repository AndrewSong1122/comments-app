import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-comment-form',
    templateUrl: './comment-form.component.html',
    styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent {
    @ViewChild('commentField') commentField!: ElementRef;
    @ViewChild('userSelect') userSelect!: ElementRef;

    users = [
        { 'userID': 1, 'name': 'Kevin' },
        { 'userID': 2, 'name': 'Jeff' },
        { 'userID': 3, 'name': 'Bryan' },
        { 'userID': 4, 'name': 'Gabbey' },
    ];

    tags: string[] = [];
    comments: string[] = [];

    displayUserSelect = false;
    comment = '';
    words = this.comment.split(' ');

    getLatestCh() {
        let element = this.commentField.nativeElement;
        return element.value[element.selectionStart - 1];
    }

    selectName(e: Event) {
        let name = (e.target as Element).innerHTML;
        this.comment += name;
        this.displayUserSelect = false;
        this.commentField.nativeElement.focus();
        this.tags.push('@'+ name);
        // this.postComment();
    }

    parseInput(e: Event) {
        if (this.getLatestCh() === '@') {
            console.log('popup');
            if (!this.displayUserSelect) {
                this.displayUserSelect = !this.displayUserSelect;
            }
        } else {
            this.displayUserSelect = false;
        }
        
    this.words = this.comment.split(' ');

        for(let user of this.tags) {
            if(!this.words.includes(user)) {
this.tags.splice(this.tags.indexOf(user), 1)
            }
        }
    }

    postComment() {
        for(let user of this.tags) {
            this.notifyUser(user.substring(1));
        }
        this.comments.push(this.comment);
        this.comment = '';
    }

    notifyUser(username: string) {
        console.log(username+' has been notified');
    }
}