import './styles.scss'

export const creditsElement = (): JSX.Element => {

    const onClickUrl = (url: string) => window.open(url, '_blank')

    return (
        <div className="credits">
            <h1>Credits</h1>
            <ol>
                <li key="wallpaper">Credit to <button onClick={() => onClickUrl("https://codepen.io/chris22smith/pen/RZogMa")}>Chris Smith</button> for the wallpaper.</li>
                <li key="pdf">Credit to Mozilla for <button onClick={() => onClickUrl("https://pdf.js/")}>PDF.js</button>.</li>
                <li key="icons1">Credit to <button onClick={() => onClickUrl("https://www.flaticon.com/")}>FlatIcon</button> for various icons.</li>
                <li key="icons2">Credit to <button onClick={() => onClickUrl("https://icons8.com/")}>icons8</button> for various icons.</li>
                <li key="dosbox">Credit to the DOSBox Team and Alexander Guryanov for <button onClick={() => onClickUrl("https://js-dos.com/")}>js-dos</button>.</li>
            </ol>
        </div>)
}