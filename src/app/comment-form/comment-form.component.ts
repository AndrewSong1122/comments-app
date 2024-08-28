import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-comment-form',
    templateUrl: './comment-form.component.html',
    styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent {
    @ViewChild('commentField') commentField!: ElementRef;

    users = [
        { 'userID': 1, 'name': 'Kevin' },
        { 'userID': 2, 'name': 'Jeff' },
        { 'userID': 3, 'name': 'Bryan' },
        { 'userID': 4, 'name': 'Gabbey' },
    ];

    comments: string[] = [];

    displayUserSelect = false;
    tags: { userID: number, name: string }[] = [];
    comment = '';
    words = this.comment.split(' ');

    getLatestCh() {
        let element = this.commentField.nativeElement;
        return element.value[element.selectionStart - 1];
    }

    selectName(name: string, userID: number) {
        this.comment += name;
        this.displayUserSelect = false;
        this.commentField.nativeElement.focus();
        this.tags.push({ 'userID': userID, 'name': name });
    }

    parseInput(e: Event) {
        if (this.getLatestCh() === '@') {
            if (!this.displayUserSelect) {
                this.displayUserSelect = !this.displayUserSelect;
            }
        } else {
            this.displayUserSelect = false;
        }

        this.words = this.comment.split(' ');

        for (let user of this.tags) {
            if (!this.words.includes('@' + user.name)) {
                this.tags.splice(this.tags.indexOf(user), 1)
            }
        }
    }

    postComment() {
        for (let user of this.tags) {
            this.notifyUser(user);
        }
        this.comments.push(this.comment);
        this.comment = '';
        this.tags = [];
    }

    notifyUser(user: { userID: number, name: string }) {
        console.log(`${user.name} (ID: ${user.userID}) has been notified`);
    }
}