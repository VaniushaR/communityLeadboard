const Navigation = () => {
	return (
		<nav className="bg-pastel-lilac d-flex align-items-center justify-content-between p-3">
			<h1 className="fs-3 text-white">Take Home Project</h1>

			<a href="https://frameonesoftware.com" target="_blank">
				<img
					src="/logo.png"
					className=""
					alt="Frame One Software Logo"
					height={50}
					width={202}
				/>
			</a>
		</nav>
	);
};

export { Navigation };
