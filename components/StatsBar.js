import styles from '../styles/StatsBar.module.scss'

export default function StatsBar({ name, value }) {
    function lpad(s, width, char) {
        return (s.length >= width) ? s : (new Array(width).join(char) + s).slice(-width);
    }

    return (
        <div className={ styles.wrapper }>
            <div className={ styles.full }>
                <div id={ `${ name }` } className={ styles.percentage } data-value={ value } style={{ width: `${value}%`, backgroundColor: `#e25${lpad(Math.round(Math.abs(value)), 3, 0)}`}}></div>
                <p className={ styles.label }>{ name } | { value.toFixed(1) }%</p>
            </div>
        </div>
    )
}
