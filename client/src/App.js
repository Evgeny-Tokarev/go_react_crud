import React, {useState, useEffect, createContext} from "react"
import List from "./users/List"
import ViewUser from "./users/ViewUser"
import PageNotFound from "./users/PageNotFound"
import {Routes, Route, useLocation} from "react-router-dom"
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export const PopupCallback = createContext(null)

function GrowTransition(props) {
    return <Grow {...props} />;
}

function App() {
    const location = useLocation()
    const [displayLocation, setDisplayLocation] = useState(location)
    const [transitionStage, setTransitionStage] = useState("fadeIn")
    const [openMessage, setOpenMessage] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('success')
    useEffect(() => {
        if (location !== displayLocation) setTransitionStage("fadeOut")
    }, [location, displayLocation])

    const callback = (text, severity) => {
        setOpenMessage(true)
        setMessage(text)
        setSeverity(severity)
    }
    return (
        <div
        >
            <div
                className={`${transitionStage}`}
                onAnimationEnd={() => {
                    if (transitionStage === "fadeOut") {
                        setTransitionStage("fadeIn");
                        setDisplayLocation(location);
                    }
                }}
            >
                <PopupCallback.Provider value={callback}>
                    <Routes location={displayLocation}>
                        <Route index element={<List/>}/>
                        <Route path="/profile/:id" element={<ViewUser/>}/>
                        <Route path="*" element={<PageNotFound/>}/>
                    </Routes>
                </PopupCallback.Provider>

            </div>
            <Snackbar
                open={openMessage}
                autoHideDuration={6000}
                onClose={() => setOpenMessage(false)}
                TransitionComponent={GrowTransition}
                TransitionProps={{timeout: 1000}}
            >
                <Alert onClose={() => setOpenMessage(false)} severity={severity} sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default App;
