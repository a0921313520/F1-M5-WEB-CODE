function HeadTitleUSDT(props) {
    return (
        <div className="heading-container" style={props.style}>
            <img src={`${process.env.BASE_PATH}/img/usdt/5.png`} />
            <h2 className="usdt-weight-title">{props.title}</h2>
            <img src={`${process.env.BASE_PATH}/img/usdt/6.png`} />
        </div>
    );
}

export default HeadTitleUSDT;
