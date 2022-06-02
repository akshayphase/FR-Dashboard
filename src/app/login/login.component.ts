import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth/authservice.service';
import { StorageService } from '../services/auth/storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showLoader = false;
  username = null;
  password= null;
  forgotPassVisible = false;

  showsessionerror=false;
 
  constructor(
    private authservice:AuthService,
    private alertService: AlertService, 
    private apiService: ApiService,
    private router: Router,
    private storageService:StorageService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
  
  }
  ngAfterViewInit(){
    if(this.apiService.sessionstatus() == false){
      localStorage.clear();
    }
    if(this.apiService.error != ''){
      // this.errormsg = this.apiService.error;
      this.cdr.detectChanges();
      this.showsessionerror=true;
    }
    
    // var x = this.storageService.getEncrData('user')
    // if(x){
    //   this.loadsites(); 
    // } 
  }

  loadsites(){
    var x:any;
    x = this.storageService.getEncrData('user')
    if(x){
      this.apiService.getSites().subscribe((res:any)=>{
        if(res.Message == "Failed"){
          this.authservice.logout();
          this.router.navigateByUrl('/login');
        }else{
          this.router.navigateByUrl('/guard');
        }
      },(error)=>{
        if(error.ok== false){
          // this.alertService.warning('Session Expired');
          this.apiService.onHTTPerror(error);
        }
        console.log("Something went wrong");
      }
      )
    }
  }

  login(){
    let x:any = this.username;
    let y:any = this.password;
    var checkSpecial = /[*@!#%&()^~{}]+/.test(y);
    var checkUpper = /[A-Z]+/.test(y);
    var checkLower = /[a-z]+/.test(y);
    var checkNumber = /[0-9]+/.test(y);
    let regex = /^(?=.{6,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).*$/.test(y)
    if(x=='' && y != ''){this.errormsg =('Please enter username')}
    else if(x.length<3){this.errormsg =('Username is invalid')}
    else if(y=='' && x !=''){this.errormsg =('Please enter password')}
    else if(y=='' && x ==''){this.errormsg =('Please enter user details')}
    // else if(!regex){this.errormsg = 'Password is incorrect'}
    else{
      this.loginApiCall();
    }
  }
  errormsg:string;
  loginApiCall(){
    let x = this.username;
    let y = this.password;
    this.showLoader = true;
    if(this.username != null && this.password != null){
      this.showLoader = true;
      this.authservice.loginWithKeycloak(x,y).subscribe((res:any)=>{
        this.apiService.error='';
        this.showsessionerror = false;
        // console.log(res)
        if(res.Status == "Failed"){
          this.showLoader = false;
          this.errormsg = res.Message;
          if(res.Message == "Account is not fully set up"){
            this.errormsg ="Please contact administrator"
          }
          // this.alertService.warning(res.Message);
        }
        if(res.Message == "Valid credentials"){
          this.storageService.storeEncrData('user', res);
          this.showLoader = false;
          this.authservice.isLoggedin.next(true);
          this.authservice.getAuthStatus();
         if(this.authservice.isLoggedin){
          this.router.navigateByUrl('/guard');
          }    
        }
      },(error)=>{
        if(error){
          this.showLoader = false;
          this.errormsg = "Something went wrong!"
          // this.alertService.warning("Something went wrong!")
        };
      });
    }else{
      this.showLoader = false;
      this.errormsg = "Please enter correct details"
    }    
  }


  forgotPass(){
    let x:any = this.username;
      if(x == ''){this.errormsg =('Please enter username')}
      else if(x != '' && x.length<5){this.errormsg =('Username is invalid')}
      else{
        this.showLoader=true;
        this.authservice.forgotPassword(x).subscribe((res:any)=>{
          this.showLoader=false;          
          if(res.Status == "Success"){this.forgotPassVisible = false;this.alertService.success("Your password reset link has been sent to your Email.")}
          if(res.Status == "Failed"){this.errormsg = 'Username is invalid'}
        })
      }

    // this.alertService.warning("Something went wrong! Please try later.")
  }


}
