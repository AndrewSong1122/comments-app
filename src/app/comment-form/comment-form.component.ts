import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-comment-form',
    templateUrl: './comment-form.component.html',
    styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent {
    @ViewChild('commentField') commentField!: ElementRef;
    @ViewChild('usersPopup') usersPopup!: ElementRef;

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
    latestAt = 0;

    getLatestCh() {
        let element = this.commentField.nativeElement;
        let ch = element.value[element.selectionStart - 1];
        if (ch === '@') {
            this.latestAt = element.selectionStart;
        }
        return ch;
    }

    selectName(name: string, userID: number) {
        this.comment = this.comment.substring(0, this.latestAt) + name;
        this.displayUserSelect = false;
        this.commentField.nativeElement.focus();
        this.tags.push({ 'userID': userID, 'name': name });
    }

    parseInput(e: Event) {
        // if value === '@', bring up mentions
        // if last 2 ch in value are ' @', bring up mentions
        // otherwise, don't bring up mentions
        let element = this.commentField.nativeElement;

        if (this.getLatestCh() === '@') {
            this.displayUserSelect = true;
        } else if(element.value.length > 1 && element.value[element.selectionStart - 1] === '@' && element.value[element.selectionStart - 2] === ' ') {
            this.displayUserSelect = true;
        } else if (this.getLatestCh() === ' ') {
            this.displayUserSelect = false;
        }
    }

    updateTags() {
        this.words = this.comment.split(' ');

        for (let user of this.tags) {
            if (!this.words.includes('@' + user.name)) {
                this.tags.splice(this.tags.indexOf(user), 1)
            }
        }
    }

    // returns throttled version of parseInput()
    throttleParseInput(e: Event) {
        let lastCall = 0;
        return () => {
            const now = new Date().getTime();
            if (now - lastCall >= 100) {
                this.parseInput(e);
                lastCall = now;
            }
        };
    }

    postComment() {
        this.updateTags();
        for (let user of this.tags) {
            this.notifyUser(user);
        }
        this.comments.push(this.comment);
        this.comment = '';
        this.tags = [];
        if(this.displayUserSelect) {
            this.displayUserSelect = false;
        }
    }

    handleKeyUp() {
        if(this.commentField.nativeElement.value.length < 1) {
            this.displayUserSelect = false;
        }
    }

    handleKeyDown(e: Event, name?: string, userID?: number) {
        if (!this.displayUserSelect) return;

        if ((e as KeyboardEvent).key === 'ArrowDown') {
            if (document.activeElement?.tagName === 'INPUT') {
                ((this.usersPopup.nativeElement as Element).firstElementChild as HTMLElement).focus();
            } else {
                if (((document.activeElement as Node).nextSibling as Element).tagName === 'A') {
                    ((document.activeElement as Node).nextSibling as HTMLElement).focus();
                }
            }
        } else if ((e as KeyboardEvent).key === 'ArrowUp') {
            if ((e.target as Element).innerHTML === (this.usersPopup.nativeElement as Element).firstElementChild?.innerHTML) {
                this.commentField.nativeElement.focus();
                this.displayUserSelect = false;
            } else {
                ((e.target as Element as Node).previousSibling as HTMLElement).focus();
            }
        } else if ((e as KeyboardEvent).key === 'Enter' && name && userID) {
            this.selectName(name, userID);
        }
    }

    notifyUser(user: { userID: number, name: string }) {
        console.log(`${user.name} (ID: ${user.userID}) has been notified`);
    }
}