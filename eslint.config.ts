import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default [
	eslint.configs.recommended,
	...tseslint.configs.strict,
	{ ignores: [] },
	{
		rules: {
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/prefer-literal-enum-member": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-empty-object-type": "off"
		}
	}
]
