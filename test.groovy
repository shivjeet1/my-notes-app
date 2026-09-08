def val = System.getenv("KEYSTORE_PASSWORD")
println("raw: '" + val + "'")
def result = val ?: "password"
println("Value is: '" + result + "'")
