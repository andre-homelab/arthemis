<script lang="ts">
	import UserLogin from '$lib/components/ui/form/UserLogin.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<div class="login-container">
	<div class="login-wrapper">
		<div class="login-content">
			<div class="login-header">
				<div class="logo-section">
					<div class="logo-icon">🌿</div>
					<h1 class="logo-text">Arthemis</h1>
				</div>
				<p class="tagline">Sistema de Monitoramento Ambiental</p>
			</div>

			<UserLogin data={data.form} />

			<div class="login-footer">
				<p class="footer-text">
					Não tem uma conta? <a href="/users" class="signup-link">Solicite cadastro</a>
				</p>
			</div>
		</div>

		<div class="login-background">
			<div class="background-decoration decoration-1"></div>
			<div class="background-decoration decoration-2"></div>
			<div class="background-decoration decoration-3"></div>
			<div class="background-text">
				<h2>Bem-vindo ao Arthemis</h2>
				<p>Monitore e analise indicadores ambientais com precisão e facilidade.</p>
			</div>
		</div>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		width: 100%;
		background: linear-gradient(135deg, var(--color-sage-green-50) 0%, var(--color-sage-green-100) 100%);
		padding: 20px;
	}

	.login-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		width: 100%;
		max-width: 1000px;
		height: auto;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
		background: white;
	}

	.login-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 48px 40px;
		background: white;
		position: relative;
		z-index: 2;
	}

	.login-header {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 32px;
	}

	.logo-section {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 8px;
	}

	.logo-icon {
		font-size: 32px;
		line-height: 1;
	}

	.logo-text {
		font-size: 28px;
		font-weight: 700;
		color: var(--foreground);
		margin: 0;
		font-family: var(--font-serif);
		letter-spacing: -0.5px;
	}

	.tagline {
		font-size: 14px;
		color: var(--muted-foreground);
		margin: 0;
		font-weight: 500;
	}

	:global(.login-content .form-card) {
		border: 1px solid var(--border);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	:global(.login-content .form-card .card-header) {
		padding-bottom: 20px;
		border-bottom: 1px solid var(--border);
	}

	:global(.login-content .form-card .card-title) {
		font-size: 20px;
		font-weight: 600;
		color: var(--foreground);
	}

	:global(.login-content .form-card .card-description) {
		font-size: 14px;
		color: var(--muted-foreground);
		margin-top: 4px;
	}

	:global(.login-content .form-card .card-content) {
		padding: 20px 0;
	}

	:global(.login-content .form-card .form-body) {
		gap: 16px;
	}

	:global(.login-content .form-card .form-footer) {
		padding-top: 20px;
		border-top: 1px solid var(--border);
	}

	:global(.login-content .form-card button) {
		width: 100%;
		height: 40px;
		font-weight: 600;
		border-radius: 8px;
		transition: all 0.2s ease;
	}

	:global(.login-content .form-card button:hover:not(:disabled)) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.login-footer {
		margin-top: 24px;
		text-align: center;
	}

	.footer-text {
		font-size: 14px;
		color: var(--muted-foreground);
		margin: 0;
	}

	.signup-link {
		color: var(--primary);
		text-decoration: none;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	.signup-link:hover {
		color: var(--color-sage-green-600);
		text-decoration: underline;
	}

	.login-background {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 48px 40px;
		background: linear-gradient(135deg, var(--primary) 0%, var(--color-sage-green-600) 100%);
		color: white;
		position: relative;
		overflow: hidden;
	}

	.background-decoration {
		position: absolute;
		border-radius: 50%;
		opacity: 0.1;
	}

	.decoration-1 {
		width: 300px;
		height: 300px;
		background: white;
		top: -100px;
		right: -100px;
	}

	.decoration-2 {
		width: 200px;
		height: 200px;
		background: white;
		bottom: -50px;
		left: -50px;
	}

	.decoration-3 {
		width: 150px;
		height: 150px;
		background: white;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.background-text {
		position: relative;
		z-index: 1;
		text-align: center;
	}

	.background-text h2 {
		font-size: 28px;
		font-weight: 700;
		margin: 0 0 12px 0;
		font-family: var(--font-serif);
		letter-spacing: -0.5px;
	}

	.background-text p {
		font-size: 16px;
		margin: 0;
		opacity: 0.95;
		line-height: 1.5;
		max-width: 300px;
	}

	/* Responsividade */
	@media (max-width: 768px) {
		.login-wrapper {
			grid-template-columns: 1fr;
			max-height: none;
		}

		.login-content {
			padding: 40px 24px;
		}

		.login-background {
			display: none;
		}

		.logo-text {
			font-size: 24px;
		}

		.logo-section {
			margin-bottom: 4px;
		}

		.login-header {
			margin-bottom: 24px;
		}
	}

	@media (max-width: 480px) {
		.login-container {
			padding: 16px;
		}

		.login-content {
			padding: 32px 20px;
		}

		.logo-text {
			font-size: 20px;
		}

		.tagline {
			font-size: 12px;
		}

		:global(.login-content .form-card .card-title) {
			font-size: 18px;
		}
	}
</style>
