import "./button.scss"

const Button = (props: React.HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button className="button" {...props} />
    )
}

export default Button