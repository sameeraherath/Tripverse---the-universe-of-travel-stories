import { Button, Typography, Container, Box, Paper, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { Edit, Group, Public, Star, ArrowForward } from "@mui/icons-material";

const LandingPage = () => {
  return (
    <Box className="min-h-screen flex flex-col" sx={{ background: "#FFF9F3" }}>
      {/* Navbar Placeholder */}
      <Box sx={{ height: { xs: 56, sm: 64 } }} />

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 2, sm: 4, md: 8 },
          pb: { xs: 4, sm: 6, md: 10 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 3, sm: 4, md: 6 }}
          alignItems="center"
          direction={{ xs: "column-reverse", md: "row" }}
        >
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: "#111",
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: 24, sm: 32, md: 40, lg: 56 },
                lineHeight: { xs: 1.2, sm: 1.15 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Share Your Travel Stories with the World
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#444",
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: 14, sm: 16, md: 18, lg: 20 },
                lineHeight: { xs: 1.5, sm: 1.4 },
                textAlign: { xs: "center", md: "left" },
                px: { xs: 1, sm: 0 },
              }}
            >
              Connect with fellow travelers, share your adventures, and discover
              incredible destinations through authentic stories from real
              explorers.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 2 },
                mb: { xs: 2, sm: 2 },
                justifyContent: { xs: "center", md: "flex-start" },
                alignItems: "center",
              }}
            >
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#FF7A1A",
                  color: "#fff",
                  borderRadius: { xs: 2, sm: 3 },
                  fontWeight: 700,
                  px: { xs: 4, sm: 5 },
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: "14px", sm: "16px", md: "18px", lg: "20px" },
                  minHeight: { xs: "44px", sm: "48px", md: "56px", lg: "64px" },
                  boxShadow: "0 4px 14px 0 rgba(255, 122, 26, 0.3)",
                  border: "1px solid #e5e7eb",
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: "280px", sm: "none" },
                  "&:hover": {
                    backgroundColor: "#FF6600",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px 0 rgba(255, 122, 26, 0.4)",
                  },
                  textTransform: "none",
                  transition: "all 0.3s ease",
                }}
                endIcon={
                  <ArrowForward
                    sx={{
                      fontSize: {
                        xs: "16px",
                        sm: "18px",
                        md: "20px",
                        lg: "22px",
                      },
                    }}
                  />
                }
              >
                Start Sharing Stories
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: { xs: 2, sm: 1 },
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Star sx={{ color: "#FFD700", fontSize: { xs: 18, sm: 20 } }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#222",
                  fontSize: { xs: 12, sm: 13, md: 15 },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                4.9/5 &nbsp;·&nbsp; Free to join &nbsp;·&nbsp; No ads
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ width: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                height: { xs: 200, sm: 240, md: 260 },
                borderRadius: { xs: 2, sm: 3, md: 4 },
                position: "relative",
                overflow: "hidden",
                mx: { xs: "auto", md: 0 },
                maxWidth: { xs: "100%", sm: "500px", md: "100%" },
              }}
            >
              {/* Hero Image */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: "url('/hero.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)",
                    zIndex: 1,
                  },
                }}
              >
                {/* Travel Story Preview Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 12, sm: 16 },
                    left: { xs: 12, sm: 16 },
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: { xs: 1.5, sm: 2 },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.5, sm: 1 },
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    zIndex: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#FF7A1A",
                      fontWeight: 700,
                      fontSize: { xs: 10, sm: 11, md: 12 },
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ✈️ Travel Story Preview
                  </Typography>
                </Box>

                {/* Story Stats Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: 8, sm: 12 },
                    left: { xs: 8, sm: 12 },
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: { xs: 1.5, sm: 2 },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.5, sm: 0.5 },
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 0.5, sm: 1 },
                    zIndex: 2,
                  }}
                >
                  <Edit
                    sx={{ color: "#FF7A1A", fontSize: { xs: 14, sm: 16 } }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#FF7A1A",
                      fontWeight: 600,
                      fontSize: { xs: 10, sm: 11, md: 12 },
                    }}
                  >
                    2.3M+ Stories Shared
                  </Typography>
                </Box>

                {/* Adventure Tag */}
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 12, sm: 16 },
                    right: { xs: 12, sm: 16 },
                    background: "rgba(255, 122, 26, 0.9)",
                    borderRadius: { xs: 1.5, sm: 2 },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.5, sm: 0.5 },
                    zIndex: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: { xs: 9, sm: 10, md: 11 },
                    }}
                  >
                    🌟 Adventure Awaits
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#111",
            textAlign: "center",
            mb: { xs: 1.5, sm: 2 },
            fontSize: { xs: 20, sm: 24, md: 28, lg: 32 },
            lineHeight: { xs: 1.3, sm: 1.2 },
            px: { xs: 1, sm: 0 },
          }}
        >
          Everything You Need to Share Your Journey
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#444",
            textAlign: "center",
            mb: { xs: 4, sm: 5, md: 6 },
            fontSize: { xs: 14, sm: 15, md: 17, lg: 20 },
            lineHeight: { xs: 1.5, sm: 1.4 },
            px: { xs: 2, sm: 1, md: 0 },
          }}
        >
          Our platform provides all the tools you need to create, share, and
          discover amazing travel experiences.
        </Typography>
        <Grid
          container
          spacing={{ xs: 3, sm: 3, md: 4 }}
          justifyContent="center"
        >
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 3, md: 4 },
                borderRadius: { xs: 2, sm: 3, md: 4 },
                background: "#fff",
                textAlign: "center",
                border: "1px solid #F3F4F6",
                minHeight: { xs: 160, sm: 180, md: 180 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Edit
                sx={{
                  color: "#FF7A1A",
                  fontSize: { xs: 32, sm: 36, md: 40 },
                  mb: { xs: 1, sm: 1 },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 1, sm: 1 },
                  fontSize: { xs: 15, sm: 16, md: 18 },
                  lineHeight: { xs: 1.3, sm: 1.2 },
                }}
              >
                Rich Story Editor
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  fontSize: { xs: 12, sm: 13, md: 15 },
                  lineHeight: { xs: 1.5, sm: 1.4 },
                  px: { xs: 1, sm: 0 },
                }}
              >
                Create beautiful travel stories with our intuitive editor. Add
                photos, maps, and interactive elements.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 3, md: 4 },
                borderRadius: { xs: 2, sm: 3, md: 4 },
                background: "#fff",
                textAlign: "center",
                border: "1px solid #F3F4F6",
                minHeight: { xs: 160, sm: 180, md: 180 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Group
                sx={{
                  color: "#3B82F6",
                  fontSize: { xs: 32, sm: 36, md: 40 },
                  mb: { xs: 1, sm: 1 },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 1, sm: 1 },
                  fontSize: { xs: 15, sm: 16, md: 18 },
                  lineHeight: { xs: 1.3, sm: 1.2 },
                }}
              >
                Travel Community
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  fontSize: { xs: 12, sm: 13, md: 15 },
                  lineHeight: { xs: 1.5, sm: 1.4 },
                  px: { xs: 1, sm: 0 },
                }}
              >
                Connect with like-minded travelers, follow your favorite
                storytellers, and build lasting friendships.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 3, md: 4 },
                borderRadius: { xs: 2, sm: 3, md: 4 },
                background: "#fff",
                textAlign: "center",
                border: "1px solid #F3F4F6",
                minHeight: { xs: 160, sm: 180, md: 180 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Public
                sx={{
                  color: "#22C55E",
                  fontSize: { xs: 32, sm: 36, md: 40 },
                  mb: { xs: 1, sm: 1 },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 1, sm: 1 },
                  fontSize: { xs: 15, sm: 16, md: 18 },
                  lineHeight: { xs: 1.3, sm: 1.2 },
                }}
              >
                Destination Discovery
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  fontSize: { xs: 12, sm: 13, md: 15 },
                  lineHeight: { xs: 1.5, sm: 1.4 },
                  px: { xs: 1, sm: 0 },
                }}
              >
                Discover hidden gems and popular destinations through authentic
                stories from fellow travelers.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Why This Platform Important Section */}
      <Box sx={{ background: "#FFF", py: { xs: 4, sm: 6, md: 8, lg: 10 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111",
              textAlign: "center",
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: 20, sm: 24, md: 28, lg: 32 },
              lineHeight: { xs: 1.3, sm: 1.2 },
              px: { xs: 1, sm: 0 },
            }}
          >
            Why Tripverse Matters
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#444",
              textAlign: "center",
              mb: { xs: 4, sm: 5, md: 6 },
              fontSize: { xs: 14, sm: 15, md: 17, lg: 20 },
              lineHeight: { xs: 1.5, sm: 1.4 },
              maxWidth: "800px",
              mx: "auto",
              px: { xs: 2, sm: 1, md: 0 },
            }}
          >
            In a world of filtered content and curated feeds, Tripverse brings
            back the authenticity of real travel experiences through genuine
            storytelling.
          </Typography>

          <Grid container spacing={{ xs: 4, sm: 4, md: 5 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  pr: { md: 3 },
                  textAlign: { xs: "center", md: "left" },
                  background: "#F8F9FA",
                  borderRadius: { xs: 2, sm: 3, md: 4 },
                  p: { xs: 3, sm: 4, md: 5 },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#111",
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: 18, sm: 20, md: 24, lg: 28 },
                    lineHeight: { xs: 1.3, sm: 1.2 },
                  }}
                >
                  Inspiring Adventure Through Real Stories
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: 14, sm: 15, md: 16, lg: 18 },
                    lineHeight: { xs: 1.6, sm: 1.7 },
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  Every journey has a story worth telling. Tripverse empowers
                  explorers to share their authentic experiences, from hidden
                  local gems to breathtaking adventures, creating a global
                  tapestry of real travel wisdom.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#555",
                    mb: { xs: 3, sm: 4 },
                    fontSize: { xs: 14, sm: 15, md: 16, lg: 18 },
                    lineHeight: { xs: 1.6, sm: 1.7 },
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  Unlike traditional travel guides, our platform showcases
                  stunning visuals paired with personal narratives that capture
                  the true essence of exploration. Connect with fellow travelers
                  who share your passion for discovery and uncover destinations
                  through the eyes of those who&apos;ve walked the path before
                  you.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1.5, sm: 2 },
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: { xs: 6, sm: 8 },
                        height: { xs: 6, sm: 8 },
                        backgroundColor: "#FF7A1A",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 600,
                        fontSize: { xs: 12, sm: 13, md: 15 },
                      }}
                    >
                      Authentic Experiences
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: { xs: 6, sm: 8 },
                        height: { xs: 6, sm: 8 },
                        backgroundColor: "#3B82F6",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 600,
                        fontSize: { xs: 12, sm: 13, md: 15 },
                      }}
                    >
                      Global Community
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: { xs: 6, sm: 8 },
                        height: { xs: 6, sm: 8 },
                        backgroundColor: "#22C55E",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 600,
                        fontSize: { xs: 12, sm: 13, md: 15 },
                      }}
                    >
                      Stunning Visuals
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  background:
                    "linear-gradient(135deg, #FF7A1A 0%, #FFB347 50%, #3B82F6 100%)",
                  borderRadius: { xs: 2, sm: 3, md: 4 },
                  p: { xs: 3, sm: 4 },
                  color: "#fff",
                  textAlign: "center",
                  minHeight: { xs: 180, sm: 220, md: 280 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  mx: { xs: "auto", md: 0 },
                  maxWidth: { xs: "100%", sm: "400px", md: "100%" },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: 80,
                    height: 80,
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: 24, sm: 28, md: 36, lg: 42 },
                  }}
                >
                  195+
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: { xs: 1, sm: 1 },
                    fontSize: { xs: 14, sm: 16, md: 18, lg: 20 },
                  }}
                >
                  Countries Explored
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: 12, sm: 14, md: 16 },
                    maxWidth: "80%",
                    mx: "auto",
                    lineHeight: { xs: 1.4, sm: 1.3 },
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  Stories from every corner of the world, waiting to inspire
                  your next adventure
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Steps Section */}
      <Box sx={{ background: "#F8FAFC", py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111",
              textAlign: "center",
              mb: { xs: 4, sm: 5, md: 6 },
              fontSize: { xs: 16, sm: 18, md: 22, lg: 26 },
              lineHeight: { xs: 1.3, sm: 1.2 },
              px: { xs: 1, sm: 0 },
            }}
          >
            Start Sharing in 3 Simple Steps
          </Typography>
          <Grid
            container
            spacing={{ xs: 3, sm: 3, md: 4 }}
            justifyContent="center"
          >
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 3, md: 4 },
                  borderRadius: { xs: 2, sm: 3, md: 4 },
                  background: "#fff",
                  textAlign: "center",
                  border: "1px solid #F3F4F6",
                  minHeight: { xs: 160, sm: 180, md: 180 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 36, sm: 40, md: 44 },
                    height: { xs: 36, sm: 40, md: 44 },
                    background: "#FFEDD5",
                    color: "#FF7A1A",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: { xs: 18, sm: 20, md: 22 },
                    mb: { xs: 1.5, sm: 2 },
                    mx: "auto",
                  }}
                >
                  1
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: { xs: 1, sm: 1 },
                    fontSize: { xs: 14, sm: 15, md: 17 },
                    lineHeight: { xs: 1.3, sm: 1.2 },
                  }}
                >
                  Create Your Profile
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    fontSize: { xs: 12, sm: 13, md: 15 },
                    lineHeight: { xs: 1.5, sm: 1.4 },
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  Sign up and create your traveler profile. Add your bio, travel
                  interests, and dream destinations.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 3, md: 4 },
                  borderRadius: { xs: 2, sm: 3, md: 4 },
                  background: "#fff",
                  textAlign: "center",
                  border: "1px solid #F3F4F6",
                  minHeight: { xs: 160, sm: 180, md: 180 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 36, sm: 40, md: 44 },
                    height: { xs: 36, sm: 40, md: 44 },
                    background: "#DBEAFE",
                    color: "#3B82F6",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: { xs: 18, sm: 20, md: 22 },
                    mb: { xs: 1.5, sm: 2 },
                    mx: "auto",
                  }}
                >
                  2
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: { xs: 1, sm: 1 },
                    fontSize: { xs: 14, sm: 15, md: 17 },
                    lineHeight: { xs: 1.3, sm: 1.2 },
                  }}
                >
                  Write Your Story
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    fontSize: { xs: 12, sm: 13, md: 15 },
                    lineHeight: { xs: 1.5, sm: 1.4 },
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  Use our rich editor to craft your travel story. Add photos,
                  videos, and interactive maps to bring it to life.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 3, md: 4 },
                  borderRadius: { xs: 2, sm: 3, md: 4 },
                  background: "#fff",
                  textAlign: "center",
                  border: "1px solid #F3F4F6",
                  minHeight: { xs: 160, sm: 180, md: 180 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 36, sm: 40, md: 44 },
                    height: { xs: 36, sm: 40, md: 44 },
                    background: "#DCFCE7",
                    color: "#22C55E",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: { xs: 18, sm: 20, md: 22 },
                    mb: { xs: 1.5, sm: 2 },
                    mx: "auto",
                  }}
                >
                  3
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: { xs: 1, sm: 1 },
                    fontSize: { xs: 14, sm: 15, md: 17 },
                    lineHeight: { xs: 1.3, sm: 1.2 },
                  }}
                >
                  Share & Connect
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    fontSize: { xs: 12, sm: 13, md: 15 },
                    lineHeight: { xs: 1.5, sm: 1.4 },
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  Publish your story and connect with travelers worldwide. Get
                  feedback, tips, and inspiration for your next trip.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: "#FFF9F3",
          py: { xs: 2, sm: 3 },
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 2, sm: 0 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#888",
              textAlign: { xs: "center", sm: "left" },
              fontSize: { xs: 12, sm: 13, md: 14 },
            }}
          >
            © {new Date().getFullYear()} Tripverse. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, sm: 3 },
              justifyContent: { xs: "center", sm: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#888",
                cursor: "pointer",
                fontSize: { xs: 11, sm: 12, md: 13 },
              }}
            >
              Terms of Service
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#888",
                cursor: "pointer",
                fontSize: { xs: 11, sm: 12, md: 13 },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#888",
                cursor: "pointer",
                fontSize: { xs: 11, sm: 12, md: 13 },
              }}
            >
              Contact
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#888",
                cursor: "pointer",
                fontSize: { xs: 11, sm: 12, md: 13 },
              }}
            >
              Help
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
