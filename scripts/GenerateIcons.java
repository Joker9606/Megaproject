import java.awt.*;
import java.awt.geom.*;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;

public class GenerateIcons {
    public static void main(String[] args) throws Exception {
        int[] sizes = {48, 72, 96, 144, 180, 192, 512};
        File iconDir = new File("public/icons");
        iconDir.mkdirs();

        for (int size : sizes) {
            BufferedImage image = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g = image.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

            // Draw rounded background
            int arc = (int)(size * 0.28);
            GradientPaint bgGradient = new GradientPaint(
                0, 0, new Color(37, 99, 235), // Blue-600
                size, size, new Color(30, 64, 175) // Blue-800
            );
            g.setPaint(bgGradient);
            g.fillRoundRect(0, 0, size, size, arc, arc);

            // Draw subtle border highlight
            g.setColor(new Color(255, 255, 255, 50));
            g.setStroke(new BasicStroke((float)(size * 0.02)));
            g.drawRoundRect((int)(size*0.01), (int)(size*0.01), (int)(size*0.98), (int)(size*0.98), arc, arc);

            // Draw Shield shape in white
            double scale = size / 100.0;
            Path2D.Double shield = new Path2D.Double();
            // Shield coordinates based on 100x100
            shield.moveTo(50 * scale, 18 * scale);
            shield.lineTo(76 * scale, 26 * scale);
            shield.curveTo(76 * scale, 58 * scale, 65 * scale, 76 * scale, 50 * scale, 84 * scale);
            shield.curveTo(35 * scale, 76 * scale, 24 * scale, 58 * scale, 24 * scale, 26 * scale);
            shield.closePath();

            // Fill Shield with light glow
            g.setColor(new Color(255, 255, 255, 230));
            g.fill(shield);

            // Draw House / Heart inside shield
            Path2D.Double house = new Path2D.Double();
            house.moveTo(50 * scale, 34 * scale);
            house.lineTo(65 * scale, 48 * scale);
            house.lineTo(60 * scale, 48 * scale);
            house.lineTo(60 * scale, 64 * scale);
            house.lineTo(40 * scale, 64 * scale);
            house.lineTo(40 * scale, 48 * scale);
            house.lineTo(35 * scale, 48 * scale);
            house.closePath();

            g.setColor(new Color(37, 99, 235)); // Blue-600
            g.fill(house);

            // Draw glowing node in the center of house
            Ellipse2D.Double node = new Ellipse2D.Double(46 * scale, 49 * scale, 8 * scale, 8 * scale);
            g.setColor(new Color(6, 182, 212)); // Cyan-500
            g.fill(node);

            g.dispose();

            String name = "public/icons/icon-" + size + ".png";
            if (size == 180) {
                name = "public/icons/apple-touch-icon.png";
            }
            ImageIO.write(image, "PNG", new File(name));
            System.out.println("Generated: " + name);
        }

        // Generate maskable icon with extra padding
        int maskSize = 512;
        BufferedImage maskable = new BufferedImage(maskSize, maskSize, BufferedImage.TYPE_INT_ARGB);
        Graphics2D gMask = maskable.createGraphics();
        gMask.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        gMask.setPaint(new GradientPaint(0, 0, new Color(37, 99, 235), maskSize, maskSize, new Color(15, 23, 42)));
        gMask.fillRect(0, 0, maskSize, maskSize);

        // Centered emblem
        double scale = 3.6;
        double offsetX = 70;
        double offsetY = 80;
        Path2D.Double shield = new Path2D.Double();
        shield.moveTo((50 * scale) + offsetX, (18 * scale) + offsetY);
        shield.lineTo((76 * scale) + offsetX, (26 * scale) + offsetY);
        shield.curveTo((76 * scale) + offsetX, (58 * scale) + offsetY, (65 * scale) + offsetX, (76 * scale) + offsetY, (50 * scale) + offsetX, (84 * scale) + offsetY);
        shield.curveTo((35 * scale) + offsetX, (76 * scale) + offsetY, (24 * scale) + offsetX, (58 * scale) + offsetY, (24 * scale) + offsetX, (26 * scale) + offsetY);
        shield.closePath();

        gMask.setColor(new Color(255, 255, 255, 240));
        gMask.fill(shield);

        Path2D.Double house = new Path2D.Double();
        house.moveTo((50 * scale) + offsetX, (34 * scale) + offsetY);
        house.lineTo((65 * scale) + offsetX, (48 * scale) + offsetY);
        house.lineTo((60 * scale) + offsetX, (48 * scale) + offsetY);
        house.lineTo((60 * scale) + offsetX, (64 * scale) + offsetY);
        house.lineTo((40 * scale) + offsetX, (64 * scale) + offsetY);
        house.lineTo((40 * scale) + offsetX, (48 * scale) + offsetY);
        house.lineTo((35 * scale) + offsetX, (48 * scale) + offsetY);
        house.closePath();

        gMask.setColor(new Color(37, 99, 235));
        gMask.fill(house);

        Ellipse2D.Double node = new Ellipse2D.Double((46 * scale) + offsetX, (49 * scale) + offsetY, 8 * scale, 8 * scale);
        gMask.setColor(new Color(6, 182, 212));
        gMask.fill(node);

        gMask.dispose();
        ImageIO.write(maskable, "PNG", new File("public/icons/icon-maskable.png"));
        System.out.println("Generated: public/icons/icon-maskable.png");

        // Copy icon-192 to public/favicon.png
        BufferedImage fav = ImageIO.read(new File("public/icons/icon-48.png"));
        ImageIO.write(fav, "PNG", new File("public/favicon.png"));
        System.out.println("Generated: public/favicon.png");
    }
}
