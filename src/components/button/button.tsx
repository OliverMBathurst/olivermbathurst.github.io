import "./button.scss"

const Button = (props: React.HTMLAttributes<HTMLButtonElement>) => {
	return (
		<button className="button" {...props}>
			{props.children}
		</button>
	)
}

export default Button
