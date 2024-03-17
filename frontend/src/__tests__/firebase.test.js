const { logInWithEmailAndPassword, registerWithEmailAndPassword, signInWithGoogle, signInWithGithub } = require('../firebase');
let firebase = require('firebase/auth')

jest.mock('firebase/auth')
describe("testing local auth functions in firebase.js",()=>{
  describe("testing email/pass registration",()=>{
    test("Empty Name", ()=>{
      expect(async ()=> 
        await registerWithEmailAndPassword("","test","test","test")).rejects.toThrow("Please fill in all fields!");
    });
    test("Empty Email", ()=>{
      expect(async ()=> 
        await registerWithEmailAndPassword("test","","test","test")).rejects.toThrow("Please fill in all fields!");
    });
    test("Empty Password", ()=>{
      expect(async ()=> 
        await registerWithEmailAndPassword("test","test","","test")).rejects.toThrow("Please fill in all fields!");
    });
    test("Empty Confirm Password", ()=>{
      expect(async ()=> 
        await registerWithEmailAndPassword("test","test","test","")).rejects.toThrow("Please fill in all fields!");
    });
    test("Invalid Email", ()=>{
      expect(async ()=> 
        await registerWithEmailAndPassword("test","test","test","test")).rejects.toThrow("Invalid email!");
    });
    test("Passwords don't march", ()=>{
      expect(async ()=> 
        await registerWithEmailAndPassword("test","test@gmail.com","test","test123")).rejects.toThrow("Passwords do not match!");
    });
    test("Weak Password", ()=>{
      firebase.createUserWithEmailAndPassword = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.WEAK_PASSWORD))
      expect(async ()=> await registerWithEmailAndPassword("test","test@gmail.com","test","test")).rejects.toThrow('Please choose a stronger password!');
    });
    test("Email Exists", ()=>{
      firebase.createUserWithEmailAndPassword = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.EMAIL_EXISTS))
      expect(async ()=> await registerWithEmailAndPassword("test","test@gmail.com","test","test")).rejects.toThrow('This email is already in use!');
    });
    test("Invalid Email - Firebase Side", ()=>{
      firebase.createUserWithEmailAndPassword = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.INVALID_EMAIL))
      expect(async ()=> await registerWithEmailAndPassword("test","test@gmail.com","test","test")).rejects.toThrow('Invalid email!');
    });
    test("Returns user successfuly", async ()=>{
      const mockedReturn = {user:{uid:"test"}}
      firebase.createUserWithEmailAndPassword = jest.fn(()=>mockedReturn)
      const val =  await registerWithEmailAndPassword("test","test@gmail.com","test","test");
      expect(val).toBe('test');
    });
})
  describe("testing email/pass login",()=>{
    test("Empty Email", ()=>{
      expect(async ()=> 
        await logInWithEmailAndPassword("","")).rejects.toThrow("Please fill in all fields!");
    });
    test("Empty Password", ()=>{
      expect(async ()=> 
        await logInWithEmailAndPassword("test","")).rejects.toThrow("Please fill in all fields!");
    });
    test("Returns user successfuly", async ()=>{
      const mockedReturn = {user:{uid:"test"}}
      firebase.signInWithEmailAndPassword = jest.fn(()=>mockedReturn)
      const val =  await logInWithEmailAndPassword("test@gmail.com","test");
      expect(val).toBe('test');
    });
    test("Invalid Credentials", ()=>{
      firebase.signInWithEmailAndPassword = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.INVALID_IDP_RESPONSE))
      expect(async ()=> await logInWithEmailAndPassword("test@gmail.com","test")).rejects.toThrow('The email and/or password you entered is incorrect!');
    });
    
  })

  describe("Google Sign In",()=>{
    test("Returns user successfuly", async ()=>{
      const mockedReturn = {user:{ displayName:"test",email:"test",uid:"test"}}
      firebase.signInWithPopup = jest.fn(()=>mockedReturn)
      const val =  await signInWithGoogle();
      const expectedReturn = { name:"test",email:"test",uid:"test"};
      expect(val).toStrictEqual(expectedReturn);
    });
    test("Email Exists", ()=>{
      firebase.signInWithPopup = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.NEED_CONFIRMATION))
      expect(async ()=> await signInWithGoogle()).rejects.toThrow('This email is in use through different service!');
    });
    
  })

  describe("Github Sign In",()=>{
    test("Returns user successfuly", async ()=>{
      const mockedReturn = {user:{ displayName:"test",email:"test",uid:"test"}}
      firebase.signInWithPopup = jest.fn(()=>mockedReturn)
      const val =  await signInWithGithub();
      const expectedReturn = { name:"test",email:"test",uid:"test"};
      expect(val).toStrictEqual(expectedReturn);
    });
    test("Email Exists", ()=>{
      firebase.signInWithPopup = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.NEED_CONFIRMATION))
      expect(async ()=> await signInWithGithub()).rejects.toThrow('This email is in use through different service!');
    });
    
  })

  
})