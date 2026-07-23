import style from './MazeMap.module.scss'

type PropTypes = {
    height: string
    campusId: number,
    zLevel: number,
    center: {
        x: number,
        y: number,
    },
    zoom: number,
    sharePoi: number,
}

type MazeMapLophtetProps = Pick<PropTypes, 'height'>

export default function MazeMap({
    height,
    campusId,
    zLevel,
    center,
    zoom,
    sharePoi,
}: PropTypes) {
    return <div className={style.MazeMap} style={{ height }}>
        <iframe
            title="MazeMap"
            src={
                'https://use.mazemap.com/embed.html#v=1&' +
                `campusid=${campusId}&` +
                `zlevel=${zLevel}&` +
                `center=${center.x},${center.y}&` +
                `zoom=${zoom}&` +
                'wheelzoom=false&' +
                'sharepoitype=poi&' +
                `sharepoi=${sharePoi}&` +
                'utm_medium=iframe'
            }
            className={style.MazeMapIframe}
        />
    </div>
}

export function MazeMapLophtet({ height }: MazeMapLophtetProps) {
    return <MazeMap
        height={height}
        campusId={1}
        zLevel={-1}
        center={{
            x: 10.402228,
            y: 63.418368,
        }}
        zoom={18}
        sharePoi={83}
    />
}
