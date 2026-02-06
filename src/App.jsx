import LoginPage from './features/auth/pages/LoginPage';
import LandingPage from './features/auth/pages/LandingPage';
import HomePage from './features/auth/pages/HomePage';
import QuestionsPage from './features/auth/pages/QuestionsPage';
import { useState } from "react";


const App = () => {
    const [user, setUser] = useState(null);
    const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
    const [currentPage, setCurrentPage] = useState('landing'); // Inicio de la apk es login, para web es landing
    const [successMessage, setSuccessMessage] = useState(null);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setCurrentPage('home');
        setSuccessMessage(null);
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentPage('landing'); // Al cerrar sesión, regresa a la página de inicio  landing  o login
        setSelectedConvocatoria(null);
        setSuccessMessage(null);
    };

    const handleConvocatoriaSelect = (convocatoriaData) => {
        console.log('paso');
        console.log(convocatoriaData);
        setSelectedConvocatoria(convocatoriaData);
        setCurrentPage('questions');
    };

    const handleRegisterSuccess = (message) => {
        setSuccessMessage(message);
        setCurrentPage('login');
    };

    const handleNavigateBack = () => {
        setCurrentPage('home');
        setSelectedConvocatoria(null);
    };

    let pageContent;

    // Lógica para mostrar la página de inicio (Landing Page)
    if (currentPage === 'landing') {
        pageContent = <LandingPage onLoginClick={() => setCurrentPage('login')} />;
    }
    // Lógica para el resto de las páginas (tu código original)
    else if (user) {
        if (currentPage === 'questions') {
            pageContent = <QuestionsPage user={user} onLogout={handleLogout} selectedConvocatoria={selectedConvocatoria} onNavigateBack={handleNavigateBack} />;
        } else {
            pageContent = <HomePage user={user} onLogout={handleLogout} onConvocatoriaSelect={handleConvocatoriaSelect} />;
        }
    } else {
        pageContent = (
            <LoginPage
                page={currentPage}
                onLoginSuccess={handleLoginSuccess}
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateToLogin={() => setCurrentPage('login')}
                onNavigateToRegister={() => setCurrentPage('register')}
                successMessage={successMessage}
            />
        );
    }

    return <div className="font-sans">{pageContent}</div>;
};

export default App;

/*import LoginPage from './features/auth/pages/LoginPage';
import HomePage from './features/auth/pages/HomePage';
import QuestionsPage from './features/auth/pages/QuestionsPage';
import { useState, useEffect } from "react";

const App = () => {
    const [user, setUser] = useState(null);
    const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
     const [currentPage, setCurrentPage] = useState('login');
     const [successMessage, setSuccessMessage] = useState(null);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setCurrentPage('home');
        setSuccessMessage(null);
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentPage('login');
        setSelectedConvocatoria(null);
        setSuccessMessage(null);
    };

    const handleConvocatoriaSelect = (convocatoriaData) => {
        setSelectedConvocatoria(convocatoriaData);
        setCurrentPage('questions');
    };

    const handleRegisterSuccess = (message) => {
        setSuccessMessage(message);
        setCurrentPage('login');
    };

    const handleNavigateBack = () => {
        setCurrentPage('home');
        setSelectedConvocatoria(null);
    };

    let pageContent;
    if (user) {
        /*if (selectedConvocatoria) {
            pageContent = <QuestionsPage user={user} onLogout={handleLogout} selectedConvocatoria={selectedConvocatoria} />;
        } else {
            pageContent = <HomePage user={user} onLogout={handleLogout} onConvocatoriaSelect={handleConvocatoriaSelect} />;
        }
        if (currentPage === 'questions') {
            pageContent = <QuestionsPage user={user} onLogout={handleLogout} selectedConvocatoria={selectedConvocatoria} onNavigateBack={handleNavigateBack} />;
        } else {
            pageContent = <HomePage user={user} onLogout={handleLogout} onConvocatoriaSelect={handleConvocatoriaSelect} />;
        }
    } else {
        //pageContent = <LoginPage onLoginSuccess={handleLoginSuccess} />;

        pageContent = (
            <LoginPage
                page={currentPage}
                onLoginSuccess={handleLoginSuccess}
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateToLogin={() => setCurrentPage('login')}
                onNavigateToRegister={() => setCurrentPage('register')}
                successMessage={successMessage}
            />
        );
    }

    return <div className="font-sans">{pageContent}</div>;
};

export default App;*/