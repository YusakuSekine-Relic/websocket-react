import { Link } from 'react-router-dom';

type RouteType = {
    path : string;
    name : string;
}

const routes: RouteType[] = [
    { path: '/', name: 'Home'},
    { path: '/client', name: 'Client'},
    { path: '/streamer', name: 'Streamer'},
]

export const Routing = () => {
    return (
        <div>
            <ul style={{paddingLeft: 0}}>
                {routes.map((route) => (
                    <li style={{display: 'inline', margin: '5px'}}>
                        <Link to={route.path}>{route.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
