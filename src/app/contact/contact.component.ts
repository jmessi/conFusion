import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { expand, flyInOut } from '../animations/app.animations';
import { FeedbackService } from '../services/feedback.service';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  @ViewChild('fform') feedbackFormDirective: any;
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  submitted = null;
  showForm = true;
  errMess: string;

  formErrors ={
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email':''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must be at least 2 characters long',
      'maxlength': ' First name cannot be longer than 25 characters'
    },
    'lastname':{
      'required': 'First name is required',
      'minlength': 'First name must be at least 2 characters long',
      'maxlength': ' First name cannot be longer than 25 characters'
    },
    'telnum': {
      'required': 'Telephone number is required',
      'pattern': 'Tel. number must contain only numbers'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email must have a valid format'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private feedbackService: FeedbackService) {}

  ngOnInit(){
    this.createForm();
  }

  createForm(){
    this.feedbackForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any){
    if (!this.feedbackForm) { return; }

    const form = this.feedbackForm;

    for (const field in this.formErrors){

      if (this.formErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors){

            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);

    this.showForm = false;

    this.feedbackService.submitFeedback(this.feedback)
      .subscribe(feedback => {
        this.submitted = feedback;
        this.feedback = null;
        setTimeout(() => {
          this.submitted = null;
          this.showForm = true;
        }, 5000);
      },

      error => console.log(error.status, error.message)
      // errmess => {
      //   this.feedback = null;
      //   this.errMess = <any>errmess;}
     );


      this.feedbackForm.reset({
        firstname: '',
        lastname: '',
        telnum: '',
        email: '',
        agree: false,
        contacttype: 'None',
        message: ''
      });

      this.feedbackFormDirective.resetForm();
  }
}
