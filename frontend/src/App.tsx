import React, { useEffect, useState } from 'react';
import {
    GoogleLogin,
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
} from 'react-google-login';
import axios from 'axios';
import { gapi } from 'gapi-script';

const App: React.FC = () => {
    const [isGapiReady, setIsGapiReady] = useState(false);
    // Initialize gapi client
    useEffect(() => {
        const loadGapiClient = () => {
            gapi.load('client:auth2', () => {
                gapi.client
                    .init({
                        clientId:
                            '1079032050078-rvjpv3dikni78v74nkvn78eingk5sp1u.apps.googleusercontent.com',
                        plugin_name: 'chat',
                    })
                    .then(() => {
                        setIsGapiReady(true);
                    })
                    .catch((error: any) => {
                        console.error('Error initializing gapi client:', error);
                    });
            });
        };

        loadGapiClient();
    }, []);
    const handleLoginSuccess = async (
        response: GoogleLoginResponse | GoogleLoginResponseOffline
    ) => {
        if ('tokenId' in response) {
            const { tokenId } = response;
            try {
                const res = await axios.post(
                    'http://localhost:3000/authentication/google',
                    { token: tokenId }
                );
                console.log('Login successful:', res.data);
            } catch (error) {
                console.error('Login failed:', error);
            }
        }
    };

    const handleLoginFailure = (response: any) => {
        if (response.error === 'popup_closed_by_user') {
            console.error(
                'Login failed: The popup was closed before completing the sign-in.'
            );
        } else {
            console.error('Login failed:', response);
        }
    };

    return (
        <div className='App'>
            <GoogleLogin
                clientId='1079032050078-rvjpv3dikni78v74nkvn78eingk5sp1u.apps.googleusercontent.com'
                buttonText='Login with Google'
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};

export default App;
