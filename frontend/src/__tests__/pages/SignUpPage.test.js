import React from 'react';
import { render, fireEvent, waitFor, screen, getByLabelText } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import SignUpPage from '../../pages/SignUpPage';
import * as firebase from '../../firebase'
import * as ErrorReport from "../../services/ErrorReport";
const router = require('react-router-dom')

jest.mock('../../firebase', () => ({
    registerWithEmailAndPassword: jest.fn(),
    signInWithGoogle: jest.fn(),
    signInWithGithub: jest.fn()
  }));
// jest.mock('react-router-dom',()=>({
//         ...jest.requireActual('react-router-dom'),
//         useNavigate: () => ({
//             navigate: () => {jest.fn()}
//         })
// }))
jest.mock('../../hooks/useSignUp', () => ({
    useSignup: ()=>({
        signup: () => jest.fn()
    }),
}));
jest.mock

describe("Sign up Page",()=>{
    let mockErrorReport;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(global.console, 'log').mockImplementationOnce(()=>{})
        jest.spyOn(toast, 'success');
        jest.spyOn(toast,'error')
        mockErrorReport = jest.spyOn(ErrorReport, 'ErrorReport').mockImplementation(() => 'error');
      });
    afterAll(()=>{
        global.console.log.mockRestore()
        toast.success.mockRestore()
        toast.error.mockRestore()
    })
    
    describe('Email Password submission',()=>{
        test('Error Handling',async () =>{
            const error = new Error('Error test')
            firebase.registerWithEmailAndPassword.mockRejectedValue(error)
            const {getByText} = render(<router.BrowserRouter><SignUpPage/></router.BrowserRouter>)
            const signUpButton = getByText('Sign Up')
            fireEvent.click(signUpButton)
            await waitFor(()=>{
                expect(toast.error).toHaveBeenCalledWith('Error test')
                expect(mockErrorReport).toHaveBeenCalledTimes(1);
            });
        }, 10000)
        test('Successful Registration',async () =>{
            const {getByText} = render(<router.BrowserRouter><SignUpPage/></router.BrowserRouter>)
            const signUpButton = getByText('Sign Up')
            fireEvent.click(signUpButton)
            await waitFor(()=>{
                expect(toast.success).toHaveBeenCalledWith("User registered!")
                // expect(navigate).toHaveBeenCalledWith('/translate')
            })
        })
    })
    describe('Google Sign-in Submission',()=>{
        test('Error Handling',async () =>{
            const error = new Error('Error test')
            firebase.signInWithGoogle.mockRejectedValue(error)
            const {getByTitle} = render(<router.BrowserRouter><SignUpPage/></router.BrowserRouter>)
            const googlebutton = getByTitle(`google-button`)
            fireEvent.click(googlebutton)
            await waitFor(()=>{
                expect(toast.error).toHaveBeenCalledWith('Error test')
                expect(mockErrorReport).toHaveBeenCalledTimes(1);
            });
        })
        test('Successful Registration',async () =>{
  
            firebase.signInWithGoogle.mockReturnValue({name:"test",email:"test",uid:"test"})
            const {getByTitle} = render(<router.BrowserRouter><SignUpPage/></router.BrowserRouter>)
            const googlebutton = getByTitle(`google-button`)
            fireEvent.click(googlebutton)
            await waitFor(()=>{
                expect(toast.success).toHaveBeenCalledWith("User registered!")
                // expect(navigate).toHaveBeenCalledWith('/translate')
            })
        })
    })
    describe('Github Sign-in Submission',()=>{
        test('Error Handling',async () =>{
            const error = new Error('Error test')
            firebase.signInWithGithub.mockRejectedValue(error)
            const {getByTitle} = render(<router.BrowserRouter><SignUpPage/></router.BrowserRouter>)
            const githubbutton = getByTitle(`github-button`)
            fireEvent.click(githubbutton)
            await waitFor(()=>{
                expect(toast.error).toHaveBeenCalledWith('Error test')
                expect(mockErrorReport).toHaveBeenCalledTimes(1);
            });
        })
        test('Successful Registration',async () =>{
  
            firebase.signInWithGithub.mockReturnValue({name:"test",email:"test",uid:"test"})
            const {getByTitle} = render(<router.BrowserRouter><SignUpPage/></router.BrowserRouter>)
            const githubbutton = getByTitle(`github-button`)
            fireEvent.click(githubbutton)
            await waitFor(()=>{
                expect(toast.success).toHaveBeenCalledWith("User registered!")
                // expect(navigate).toHaveBeenCalledWith('/translate')
            })
        })
    })
})
