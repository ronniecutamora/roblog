import type { RootState } from "../app/store.ts";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";

export default function ThemeToggle(){
    
    const mode = useSelector((state:RootState) => state.theme.mode);
    const dispatch = useDispatch();
    

    return(
        <div>
            <p>current mode: {mode}</p>
            <button onClick={() => dispatch(toggleTheme())}>Toggle Theme</button>
        </div>
    );
}