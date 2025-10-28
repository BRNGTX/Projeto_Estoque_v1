﻿using Dominio.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Projeto2025_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SegurancaController : ControllerBase
    {
        private IConfiguration _config;
        public SegurancaController(IConfiguration Configuration)
        {
            _config = Configuration;
        }
        /// <summary>
        /// Realiza login e retorna token JWT
        /// </summary>
        /// <param name="loginDetalhes">Credenciais de login (user: ana, senha: 123456)</param>
        /// <returns>Token JWT para autenticação</returns>
        [HttpPost]
        public IActionResult Login([FromBody] UsuarioDTO loginDetalhes)
        {
            bool resultado = ValidarUsuario(loginDetalhes);
            if (resultado)
            {
                var tokenString = GerarTokenJWT();
                return Ok(new
                {
                    access_token = tokenString,
                    token_type = "Bearer",
                    expires_in = 60 * 60 // 60 min
                });
            }
            else
            {
                return Unauthorized();
            }
        }

        /// <summary>
        /// Gera token JWT para testes no Swagger (sem necessidade de login)
        /// </summary>
        /// <returns>Token JWT válido para autenticação</returns>
        [HttpGet("token")]
        public IActionResult GetToken()
        {
            var tokenString = GerarTokenJWT();
            return Ok(new
            {
                access_token = tokenString,
                token_type = "Bearer",
                expires_in = 60 * 60, // 60 min
                message = "Token gerado com sucesso! Use este token no campo 'Bearer' do Swagger.",
                instructions = "Copie o valor de 'access_token' e cole no campo 'Bearer' do Swagger UI"
            });
        }
        private string GerarTokenJWT()
        {
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, "1"),
        new Claim(JwtRegisteredClaimNames.UniqueName, "ana"),
        new Claim(ClaimTypes.Role, "Admin")
    };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private bool ValidarUsuario(UsuarioDTO loginDetalhes)
        {
            if (loginDetalhes.user == "ana" && loginDetalhes.Senha == "123456")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

    }
}
