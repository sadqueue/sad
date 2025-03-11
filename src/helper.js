export const getConfigNavbar = () => {
    return (<ul>
        <li><a href="/sad#/calculator">ALR & Composite Calculator</a></li>
        <li><a href="/sad#/data">Data</a></li>
        <li><a href="/sad#/statistics">Statistics</a></li>
        <li><a href="/sad#/triage">Triage</a></li>
        <li><a href="/sad#/searchdata">Search Admissions Notes</a></li>
        <li><a href="/sad#/login">Settings</a></li>
        <li><a href="/sad#/login" onClick={() => localStorage.removeItem("loggedin")}>
            Logout
        </a></li>
    </ul>)
}