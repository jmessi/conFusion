import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Params, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishCopy: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  visibility = 'shown';
  @ViewChild('cform') commentFormDirective: any;

  formErrors ={
    'author':'',
    'comment': ''
  };

  validationMessages= {
    'author':{
      'required': 'Name is required ಠ ∩ ಠ',
      'minlength': 'Name must be at least 2 characters long',
      'maxlength': ' Name cannot be longer than 25 characters'
    },
    'comment':{
      'required': 'This cannot be empty ｡゜(｀Д´)゜｡',
      'minlength': 'Comment should be at least 1 character long',
      'maxlength': 'First name cannot be longer than 25 characters'
    }
  };

  constructor(
    private dishService: DishService,
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    @Inject('BaseURL') public BaseURL) { }

  createForm() {
    this.commentForm = this.formBuilder.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      date: '',
    });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any){
    if (!this.commentForm) { return; }

    const form = this.commentForm;

    for(const field in this.formErrors){

      if(this.formErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);

        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){

            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    this.createForm();
    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);

    this.route.params
    .pipe(switchMap((params: Params) => {
      this.visibility = 'hidden';
      return this.dishService.getDish(+params['id']);
    }))
    .subscribe(
      dish => {
        this.dish = dish;
        this.dishCopy = dish;
        this.setPrevNext(dish.id);
        this.visibility = 'shown';
      },
      errmess => this.errMess = <any>errmess
      );
    }

  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString(); //sets date to comment
    this.dishCopy.comments.push(this.comment); //pushes complete comment into Comments of Dish
    this.dishService.putDish(this.dishCopy)
      .subscribe(dish => {
        this.dish = dish;
        this.dishCopy = dish;
      },
      errmess => {
        this.dish = null;
        this.dishCopy = null;
        this.errMess = <any>errmess;
      });

    console.log(this.comment);

    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });

  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

}
